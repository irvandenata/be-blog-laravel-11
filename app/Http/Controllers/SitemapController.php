<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\SeoSetting;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $articles = Article::with('images')
            ->where('status', 'publish')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response($this->buildSitemap($articles), 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    private function buildSitemap($articles): string
    {
        $baseUrl = rtrim(SeoSetting::get('site_url', config('app.url', 'https://ivd.my.id')), '/');

        $urls = [
            $this->makeUrl($baseUrl . '/', '1.0', 'weekly'),
            $this->makeUrl(
                $baseUrl . '/blogs',
                '0.9',
                'daily',
                optional($articles->first()?->updated_at)->toAtomString()
            ),
        ];

        foreach ($articles as $article) {
            $urls[] = $this->makeUrl(
                $baseUrl . '/blogs/' . $article->slug,
                '0.8',
                'weekly',
                optional($article->updated_at ?? $article->created_at)->toAtomString(),
                $this->imageTag($article, $baseUrl)
            );
        }

        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            . 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n"
            . implode("\n", $urls) . "\n"
            . '</urlset>';
    }

    /**
     * Every article gets an image entry: the uploaded cover when present,
     * otherwise the generated flat-design card.
     */
    private function imageTag($article, string $baseUrl): string
    {
        $cover = $article->images->firstWhere('is_cover', true) ?? $article->images->first();

        $loc = $cover
            ? rtrim(config('app.url'), '/') . '/storage/' . ltrim($cover->image, '/')
            : $baseUrl . '/og/article/' . $article->slug . '.svg';

        return "\n    <image:image>\n      <image:loc>" . e($loc) . '</image:loc>'
            . "\n      <image:title>" . e($article->title) . "</image:title>\n    </image:image>";
    }

    private function makeUrl(string $loc, string $priority, string $changefreq, ?string $lastmod = null, string $extra = ''): string
    {
        $lastmodTag = $lastmod ? "\n    <lastmod>{$lastmod}</lastmod>" : '';

        return "  <url>\n    <loc>" . e($loc) . "</loc>{$lastmodTag}"
            . "\n    <changefreq>{$changefreq}</changefreq>"
            . "\n    <priority>{$priority}</priority>{$extra}\n  </url>";
    }
}
