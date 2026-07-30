<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\SeoSetting;
use App\Services\PageMetaService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Serves the SPA shell with server-rendered <head> metadata and a
 * crawler-readable <noscript> body, so non-JS crawlers index real content.
 */
class PageController extends Controller
{
    public function __construct(private PageMetaService $meta)
    {
    }

    public function __invoke(Request $request, ?string $any = null)
    {
        $path = '/' . trim($any ?? '', '/');
        $meta = $this->meta->forPath($path);
        $locale = ($path === '/en' || Str::startsWith($path, '/en/')) ? 'en' : 'id';

        return response()
            ->view('app', [
                'meta' => $meta,
                'crawlerContent' => $this->crawlerContent($path, $locale),
            ])
            ->header('X-Robots-Tag', $meta['robots']);
    }

    /**
     * Real, indexable HTML for crawlers that never run JavaScript.
     * Hidden from users behind <noscript>; identical in substance to what the
     * SPA renders, so it is not cloaking.
     */
    private function crawlerContent(string $path, string $locale = 'id'): array
    {
        // The English mount serves the same tree; resolve against the bare path.
        if ($locale === 'en') {
            $path = '/' . trim(Str::after($path, '/en'), '/');
        }

        $prefix = $locale === 'en' ? '/en' : '';

        if ($path === '/blogs') {
            $articles = Article::with('category')
                ->where('status', 'publish')
                ->latest('created_at')
                ->limit(50)
                ->get();

            return [
                'heading' => SeoSetting::get('blog_title', 'Articles & Blog'),
                'intro' => SeoSetting::get('blog_description', ''),
                'links' => $articles->map(fn ($a) => [
                    'url' => $prefix . '/blogs/' . $a->slug,
                    'title' => $this->localized($a, 'title', $locale),
                    'category' => $a->category?->name,
                    'date' => optional($a->created_at)->toFormattedDateString(),
                ])->all(),
                'body' => null,
            ];
        }

        if (Str::startsWith($path, '/blogs/')) {
            $article = Article::with(['category', 'tags'])
                ->where('slug', Str::after($path, '/blogs/'))
                ->where('status', 'publish')
                ->first();

            if (! $article) {
                return [];
            }

            return [
                'heading' => $this->localized($article, 'title', $locale),
                'intro' => trim(collect([
                    $article->category?->name,
                    optional($article->created_at)->toFormattedDateString(),
                    $article->tags->pluck('name')->implode(', '),
                ])->filter()->implode(' · ')),
                'links' => [],
                // Content is authored in the admin WYSIWYG; strip to a safe
                // subset rather than echoing arbitrary stored markup.
                'body' => strip_tags(
                    $this->localized($article, 'content', $locale) ?? '',
                    '<p><h2><h3><h4><ul><ol><li><blockquote><strong><em><code><pre><br>'
                ),
            ];
        }

        return [];
    }

    /**
     * Locale-resolved field with the Indonesian fallback, so the noscript body a
     * crawler reads matches what the SPA renders for the same URL.
     */
    private function localized(Article $article, string $field, string $locale): ?string
    {
        if ($locale !== 'en') {
            return $article->{$field};
        }

        $translated = $article->{"{$field}_en"};

        return filled(is_string($translated) ? trim($translated) : $translated)
            ? $translated
            : $article->{$field};
    }
}
