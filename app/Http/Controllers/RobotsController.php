<?php

namespace App\Http\Controllers;

use App\Models\SeoSetting;
use Illuminate\Http\Response;

/**
 * robots.txt served from the app so the admin panel's AI-crawler toggle
 * actually takes effect. Note: public/robots.txt must be removed, or the
 * web server serves that static file before Laravel ever runs.
 */
class RobotsController extends Controller
{
    /**
     * Crawlers used to build and ground LLM answers. Allowing these is what
     * gets the site cited in AI search results.
     */
    private const AI_CRAWLERS = [
        'GPTBot',
        'OAI-SearchBot',
        'ChatGPT-User',
        'ClaudeBot',
        'Claude-User',
        'Claude-SearchBot',
        'anthropic-ai',
        'PerplexityBot',
        'Perplexity-User',
        'Google-Extended',
        'Applebot-Extended',
        'CCBot',
        'meta-externalagent',
        'Amazonbot',
        'cohere-ai',
        'DuckAssistBot',
        'MistralAI-User',
        'YouBot',
    ];

    public function __invoke(): Response
    {
        $baseUrl = rtrim(SeoSetting::get('site_url', config('app.url')), '/');
        $allowAi = SeoSetting::get('ai_crawlers_allowed', '1') === '1';

        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /admin/',
            'Disallow: /api/',
            'Disallow: /login',
            'Disallow: /not-found',
            '',
        ];

        foreach (self::AI_CRAWLERS as $bot) {
            $lines[] = 'User-agent: ' . $bot;

            if ($allowAi) {
                $lines[] = 'Allow: /';
                $lines[] = 'Disallow: /admin';
            } else {
                $lines[] = 'Disallow: /';
            }

            $lines[] = '';
        }

        $lines[] = 'Sitemap: ' . $baseUrl . '/sitemap.xml';
        $lines[] = '';

        return response(implode("\n", $lines), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
