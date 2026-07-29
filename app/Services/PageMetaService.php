<?php

namespace App\Services;

use App\Models\Article;
use App\Models\SeoSetting;
use Illuminate\Support\Str;

/**
 * Resolves the <head> metadata for a server-rendered page.
 *
 * The frontend is a client-side SPA, so crawlers that do not execute JavaScript
 * (Bing, Slack/Twitter/Facebook unfurlers, GPTBot, ClaudeBot, PerplexityBot)
 * only ever see what Blade emits. Everything a crawler needs is resolved here.
 */
class PageMetaService
{
    private const DESCRIPTION_LIMIT = 160;

    public function forPath(string $path): array
    {
        $path = '/' . trim($path, '/');

        if ($path === '/blogs') {
            return $this->blogIndex();
        }

        if (Str::startsWith($path, '/blogs/')) {
            return $this->article(Str::after($path, '/blogs/'));
        }

        if ($this->isPrivatePath($path)) {
            return $this->defaults($path, noindex: true);
        }

        return $this->defaults($path);
    }

    private function isPrivatePath(string $path): bool
    {
        return Str::startsWith($path, ['/admin', '/login', '/logout', '/not-found']);
    }

    private function baseUrl(): string
    {
        return rtrim(SeoSetting::get('site_url', config('app.url', 'https://ivd.my.id')), '/');
    }

    private function defaultImage(): string
    {
        return SeoSetting::get('default_og_image') ?: $this->baseUrl() . '/og-default.svg';
    }

    private function title(?string $pageTitle): string
    {
        $default = SeoSetting::get('default_title', 'ivd.my.id');

        if (! $pageTitle) {
            return $default;
        }

        $template = SeoSetting::get('title_template', '%s');

        return trim(sprintf($template, $pageTitle));
    }

    /**
     * Shared scaffolding every page gets: verification tags, locale, author.
     */
    private function common(): array
    {
        return [
            'site_name' => SeoSetting::get('site_name', 'ivd.my.id'),
            'locale' => SeoSetting::get('locale', 'id_ID'),
            'author' => SeoSetting::get('author_name', 'Irvan Denata'),
            'author_url' => SeoSetting::get('author_url', $this->baseUrl()),
            'twitter_handle' => SeoSetting::get('twitter_handle'),
            'google_verification' => SeoSetting::get('google_site_verification'),
            'bing_verification' => SeoSetting::get('bing_site_verification'),
            'section' => null,
            'tags' => [],
        ];
    }

    private function defaults(string $path, bool $noindex = false): array
    {
        $baseUrl = $this->baseUrl();

        return array_merge($this->common(), [
            'title' => $this->title(null),
            'description' => SeoSetting::get('default_description', ''),
            'keywords' => SeoSetting::get('default_keywords', ''),
            'canonical' => $baseUrl . ($path === '/' ? '/' : $path),
            'image' => $this->defaultImage(),
            'type' => 'website',
            'robots' => $noindex
                ? 'noindex, nofollow'
                : SeoSetting::get('robots_default', 'index, follow'),
            'published_time' => null,
            'modified_time' => null,
            'structured_data' => $noindex ? [] : [$this->websiteSchema(), $this->personSchema()],
            'prefetch' => null,
        ]);
    }

    private function blogIndex(): array
    {
        $baseUrl = $this->baseUrl();
        $title = SeoSetting::get('blog_title', 'Articles & Blog');
        $description = SeoSetting::get('blog_description', '');

        return array_merge($this->common(), [
            'title' => $this->title($title),
            'description' => $description,
            'keywords' => SeoSetting::get('default_keywords', ''),
            'canonical' => $baseUrl . '/blogs',
            'image' => $this->defaultImage(),
            'type' => 'website',
            'robots' => SeoSetting::get('robots_default', 'index, follow'),
            'published_time' => null,
            'modified_time' => null,
            'prefetch' => null,
            'structured_data' => [
                $this->breadcrumbSchema([
                    ['name' => 'Home', 'item' => $baseUrl . '/'],
                    ['name' => $title, 'item' => $baseUrl . '/blogs'],
                ]),
                $this->blogListSchema($title, $description),
            ],
        ]);
    }

    private function article(string $slug): array
    {
        $article = Article::with(['category', 'tags', 'images'])
            ->where('slug', $slug)
            ->first();

        if (! $article) {
            return $this->defaults('/blogs/' . $slug, noindex: true);
        }

        $baseUrl = $this->baseUrl();
        $url = $baseUrl . '/blogs/' . $article->slug;
        $description = $this->articleDescription($article);
        $image = $this->articleImage($article);
        $isPublished = $article->status === 'publish';

        $keywords = $article->meta_keywords
            ?: collect([$article->category?->name])
                ->merge($article->tags->pluck('name'))
                ->filter()
                ->unique()
                ->implode(', ');

        return array_merge($this->common(), [
            'title' => $this->title($article->title),
            'description' => $description,
            'keywords' => $keywords,
            'canonical' => $url,
            'image' => $image,
            'type' => 'article',
            'robots' => $isPublished
                ? SeoSetting::get('robots_default', 'index, follow')
                : 'noindex, nofollow',
            'published_time' => optional($article->created_at)->toAtomString(),
            'modified_time' => optional($article->updated_at)->toAtomString(),
            'section' => $article->category?->name,
            'tags' => $article->tags->pluck('name')->all(),
            // Warm the API response the SPA requests immediately after boot.
            'prefetch' => '/api/' . config('app.api_version') . '/data/articles/' . $article->slug,
            'structured_data' => $isPublished
                ? [
                    $this->breadcrumbSchema([
                        ['name' => 'Home', 'item' => $baseUrl . '/'],
                        ['name' => SeoSetting::get('blog_title', 'Blog'), 'item' => $baseUrl . '/blogs'],
                        ['name' => $article->title, 'item' => $url],
                    ]),
                    $this->articleSchema($article, $url, $description, $image, $keywords),
                ]
                : [],
        ]);
    }

    private function articleDescription(Article $article): string
    {
        $candidate = $article->meta_description
            ? html_entity_decode($article->meta_description, ENT_QUOTES | ENT_HTML5, 'UTF-8')
            : $this->plainText($article->content ?? '');

        return $this->truncateOnWord(trim($candidate) ?: $article->title, self::DESCRIPTION_LIMIT);
    }

    /**
     * Truncate at the last whole word within $limit, so snippets never end
     * mid-word. Returns the input untouched when it already fits.
     */
    private function truncateOnWord(string $text, int $limit): string
    {
        if (mb_strlen($text) <= $limit) {
            return $text;
        }

        $cut = mb_substr($text, 0, $limit);
        $lastSpace = mb_strrpos($cut, ' ');

        if ($lastSpace !== false && $lastSpace > $limit * 0.6) {
            $cut = mb_substr($cut, 0, $lastSpace);
        }

        return rtrim($cut, " \t\n\r\0\x0B.,;:—-") . '…';
    }

    /**
     * Stored content is WYSIWYG HTML: strip markup, then decode entities
     * (&nbsp;, &ldquo;) so meta tags and JSON-LD carry real text.
     */
    private function plainText(string $html): string
    {
        $text = preg_replace('/<[^>]*>/', ' ', $html) ?? $html;
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        // \xC2\xA0 is the non-breaking space left behind by &nbsp;.
        $text = str_replace("\xC2\xA0", ' ', $text);

        return trim(preg_replace('/\s+/', ' ', $text) ?? $text);
    }

    private function articleImage(Article $article): string
    {
        $cover = $article->images->firstWhere('is_cover', true) ?? $article->images->first();

        if (! $cover) {
            // No uploaded image: point at the generated flat-design card so
            // social unfurls and AI crawlers still get a real, on-brand image.
            return $this->baseUrl() . '/og/article/' . $article->slug . '.svg';
        }

        return rtrim(config('app.url'), '/') . '/storage/' . ltrim($cover->image, '/');
    }

    private function websiteSchema(): array
    {
        $baseUrl = $this->baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => $baseUrl . '/#website',
            'name' => SeoSetting::get('site_name', 'ivd.my.id'),
            'url' => $baseUrl . '/',
            'description' => SeoSetting::get('default_description', ''),
            'inLanguage' => str_replace('_', '-', SeoSetting::get('locale', 'id_ID')),
            'publisher' => ['@id' => $baseUrl . '/#person'],
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => $baseUrl . '/blogs?search={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    private function personSchema(): array
    {
        $baseUrl = $this->baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            '@id' => $baseUrl . '/#person',
            'name' => SeoSetting::get('author_name', 'Irvan Denata'),
            'url' => SeoSetting::get('author_url', $baseUrl),
            'description' => SeoSetting::get('default_description', ''),
        ];
    }

    private function blogListSchema(string $title, string $description): array
    {
        $baseUrl = $this->baseUrl();

        $articles = Article::where('status', 'publish')
            ->latest('created_at')
            ->limit(20)
            ->get(['title', 'slug', 'created_at']);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Blog',
            '@id' => $baseUrl . '/blogs#blog',
            'name' => $title,
            'description' => $description,
            'url' => $baseUrl . '/blogs',
            'inLanguage' => str_replace('_', '-', SeoSetting::get('locale', 'id_ID')),
            'author' => ['@id' => $baseUrl . '/#person'],
            'blogPost' => $articles->map(fn ($a) => [
                '@type' => 'BlogPosting',
                'headline' => $a->title,
                'url' => $baseUrl . '/blogs/' . $a->slug,
                'datePublished' => optional($a->created_at)->toAtomString(),
            ])->all(),
        ];
    }

    private function articleSchema(Article $article, string $url, string $description, string $image, string $keywords): array
    {
        $baseUrl = $this->baseUrl();
        $wordCount = str_word_count(strip_tags($article->content ?? ''));

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            '@id' => $url . '#article',
            'headline' => Str::limit($article->title, 110, ''),
            'name' => $article->title,
            'description' => $description,
            'image' => [$image],
            'url' => $url,
            'datePublished' => optional($article->created_at)->toAtomString(),
            'dateModified' => optional($article->updated_at ?? $article->created_at)->toAtomString(),
            'author' => [
                '@type' => 'Person',
                'name' => SeoSetting::get('author_name', 'Irvan Denata'),
                'url' => SeoSetting::get('author_url', $baseUrl),
            ],
            'publisher' => ['@id' => $baseUrl . '/#person'],
            'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $url],
            'isPartOf' => ['@id' => $baseUrl . '/blogs#blog'],
            'articleSection' => $article->category?->name,
            'keywords' => $keywords ?: null,
            'wordCount' => $wordCount ?: null,
            'inLanguage' => str_replace('_', '-', SeoSetting::get('locale', 'id_ID')),
            // Plain-text body: what LLM crawlers actually ingest.
            'articleBody' => Str::limit($this->plainText($article->content ?? ''), 5000, '') ?: null,
        ]);
    }

    private function breadcrumbSchema(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)->values()->map(fn ($item, $i) => [
                '@type' => 'ListItem',
                'position' => $i + 1,
                'name' => $item['name'],
                'item' => $item['item'],
            ])->all(),
        ];
    }
}
