<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\SeoSetting;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

/**
 * Machine-readable surfaces for search engines and LLM crawlers:
 * an RSS feed plus llms.txt / llms-full.txt (the convention AI crawlers
 * such as GPTBot, ClaudeBot and PerplexityBot look for).
 */
class FeedController extends Controller
{
    private function baseUrl(): string
    {
        return rtrim(SeoSetting::get('site_url', config('app.url')), '/');
    }

    public function rss(): Response
    {
        $baseUrl = $this->baseUrl();
        $siteName = $this->cdata(SeoSetting::get('site_name', 'ivd.my.id'));
        $description = $this->cdata(SeoSetting::get('default_description', ''));

        $articles = Article::with('category')
            ->where('status', 'publish')
            ->latest('created_at')
            ->limit(50)
            ->get();

        $items = $articles->map(function (Article $article) use ($baseUrl) {
            $url = $baseUrl . '/blogs/' . $article->slug;
            $summary = $article->meta_description
                ?: Str::limit($this->toPlainText($article->content ?? ''), 300);

            return collect([
                '    <item>',
                '      <title>' . $this->cdata($article->title) . '</title>',
                '      <link>' . e($url) . '</link>',
                '      <guid isPermaLink="true">' . e($url) . '</guid>',
                '      <pubDate>' . optional($article->created_at)->toRssString() . '</pubDate>',
                '      <description>' . $this->cdata($summary) . '</description>',
                $article->category ? '      <category>' . $this->cdata($article->category->name) . '</category>' : null,
                '    </item>',
            ])->filter()->implode("\n");
        })->implode("\n");

        $language = $this->rssLanguage();
        $lastBuild = $this->lastBuildDate($articles);

        $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{$siteName}</title>
    <link>{$baseUrl}/blogs</link>
    <description>{$description}</description>
    <language>{$language}</language>
    <lastBuildDate>{$lastBuild}</lastBuildDate>
    <atom:link href="{$baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
{$items}
  </channel>
</rss>
XML;

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    /**
     * Index of the site for LLM crawlers: titles, URLs, one-line summaries.
     */
    public function llms(): Response
    {
        $baseUrl = $this->baseUrl();

        $lines = [
            '# ' . SeoSetting::get('site_name', 'ivd.my.id'),
            '',
            '> ' . SeoSetting::get('default_description', ''),
            '',
            'Author: ' . SeoSetting::get('author_name', 'Irvan Denata'),
            'Site: ' . $baseUrl,
            'Full text of all articles: ' . $baseUrl . '/llms-full.txt',
            'RSS: ' . $baseUrl . '/feed.xml',
            '',
            '## Articles',
            '',
        ];

        $articles = Article::where('status', 'publish')
            ->latest('created_at')
            ->get(['title', 'slug', 'content', 'meta_description']);

        foreach ($articles as $article) {
            $summary = $article->meta_description
                ?: Str::limit(preg_replace('/\s+/', ' ', $this->toPlainText($article->content ?? '')) ?? '', 150, '');

            $lines[] = sprintf(
                '- [%s](%s/blogs/%s): %s',
                $article->title,
                $baseUrl,
                $article->slug,
                $summary
            );
        }

        return $this->text(implode("\n", $lines) . "\n");
    }

    /**
     * Full plain-text corpus, so an LLM can ingest the actual writing
     * rather than guessing from titles.
     */
    public function llmsFull(): Response
    {
        $baseUrl = $this->baseUrl();

        $lines = [
            '# ' . SeoSetting::get('site_name', 'ivd.my.id') . ' — full article text',
            '',
            'Author: ' . SeoSetting::get('author_name', 'Irvan Denata'),
            'Generated: ' . now()->toDateString(),
            '',
        ];

        Article::with(['category', 'tags'])
            ->where('status', 'publish')
            ->latest('created_at')
            ->chunk(50, function ($articles) use (&$lines, $baseUrl) {
                foreach ($articles as $article) {
                    $lines[] = '---';
                    $lines[] = '';
                    $lines[] = '## ' . $article->title;
                    $lines[] = '';
                    $lines[] = 'URL: ' . $baseUrl . '/blogs/' . $article->slug;
                    if ($article->category) {
                        $lines[] = 'Category: ' . $article->category->name;
                    }
                    if ($article->tags->isNotEmpty()) {
                        $lines[] = 'Tags: ' . $article->tags->pluck('name')->implode(', ');
                    }
                    $lines[] = 'Published: ' . optional($article->created_at)->toDateString();
                    $lines[] = '';
                    $lines[] = $this->toPlainText($article->content ?? '');
                    $lines[] = '';
                }
            });

        return $this->text(implode("\n", $lines));
    }

    /**
     * Convert stored WYSIWYG HTML into readable plain text, preserving
     * block boundaries as line breaks.
     */
    private function toPlainText(string $html): string
    {
        $withBreaks = preg_replace('/<\/(p|h[1-6]|li|div|blockquote|tr)>/i', "\n", $html) ?? $html;
        $withBreaks = preg_replace('/<br\s*\/?>/i', "\n", $withBreaks) ?? $withBreaks;

        $text = html_entity_decode(strip_tags($withBreaks), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        // \xC2\xA0 is the non-breaking space left behind by &nbsp;.
        $text = str_replace("\xC2\xA0", ' ', $text);

        // Collapse runs of blank lines, trim trailing spaces per line.
        $text = preg_replace('/[ \t]+\n/', "\n", $text) ?? $text;
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;

        return trim($text);
    }

    private function text(string $body): Response
    {
        return response($body, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    private function rssLanguage(): string
    {
        return Str::lower(str_replace('_', '-', SeoSetting::get('locale', 'id_ID')));
    }

    private function lastBuildDate($articles): string
    {
        return optional($articles->first()?->created_at)->toRssString() ?? now()->toRssString();
    }

    private function cdata(?string $value): string
    {
        return '<![CDATA[' . str_replace(']]>', ']]&gt;', (string) $value) . ']]>';
    }
}
