<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $articles = Article::where('status', 'publish')
            ->select('slug', 'updated_at', 'created_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        $xml = $this->buildSitemap($articles);

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }

    private function buildSitemap($articles): string
    {
        $baseUrl = rtrim(env('FRONTEND_URL', env('APP_URL', 'https://ivd.my.id')), '/');

        $urls = [];

        $urls[] = $this->makeUrl($baseUrl . '/', '1.0', 'weekly');
        $urls[] = $this->makeUrl($baseUrl . '/blogs', '0.8', 'daily');

        foreach ($articles as $article) {
            $urls[] = $this->makeUrl(
                $baseUrl . '/blogs/' . $article->slug,
                '0.7',
                'monthly',
                $article->updated_at->toAtomString()
            );
        }

        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n"
            . implode("\n", $urls) . "\n"
            . '</urlset>';
    }

    private function makeUrl(string $loc, string $priority, string $changefreq, ?string $lastmod = null): string
    {
        $lastmodTag = $lastmod ? "\n    <lastmod>{$lastmod}</lastmod>" : '';
        return "  <url>\n    <loc>{$loc}</loc>{$lastmodTag}\n    <changefreq>{$changefreq}</changefreq>\n    <priority>{$priority}</priority>\n  </url>";
    }
}
