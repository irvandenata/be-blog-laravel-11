<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin CRUD for the site-wide SEO defaults rendered into every page head.
 */
class SeoSettingController extends Controller
{
    /**
     * Keys the admin panel may write, with their validation rules. Anything
     * not listed here is ignored, so a crafted payload cannot introduce
     * arbitrary settings keys.
     */
    private const EDITABLE = [
        'site_name' => 'nullable|string|max:120',
        'site_url' => 'nullable|url|max:255',
        'default_title' => 'nullable|string|max:120',
        'title_template' => 'nullable|string|max:120',
        'default_description' => 'nullable|string|max:320',
        'default_keywords' => 'nullable|string|max:500',
        'default_og_image' => 'nullable|url|max:500',
        'twitter_handle' => 'nullable|string|max:50',
        'author_name' => 'nullable|string|max:120',
        'author_url' => 'nullable|url|max:255',
        'locale' => 'nullable|string|max:10',
        'robots_default' => 'nullable|string|max:200',
        'google_site_verification' => 'nullable|string|max:200',
        'bing_site_verification' => 'nullable|string|max:200',
        'blog_title' => 'nullable|string|max:120',
        'blog_description' => 'nullable|string|max:320',
        'ai_crawlers_allowed' => 'nullable|boolean',
    ];

    public function index(): JsonResponse
    {
        $stored = SeoSetting::map();

        $data = collect(self::EDITABLE)
            ->keys()
            ->mapWithKeys(fn ($key) => [$key => $stored[$key] ?? ''])
            ->all();

        return response()->json([
            'success' => true,
            'message' => 'SEO settings retrieved successfully.',
            'data' => $data,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate(self::EDITABLE);

        // title_template must contain exactly one %s placeholder, or sprintf
        // silently drops the page title from every <title> on the site.
        $template = $validated['title_template'] ?? null;
        if ($template && substr_count($template, '%s') !== 1) {
            return response()->json([
                'success' => false,
                'message' => 'Title template must contain exactly one %s placeholder.',
            ], 422);
        }

        DB::transaction(function () use ($validated) {
            foreach ($validated as $key => $value) {
                if ($key === 'ai_crawlers_allowed') {
                    $value = $value ? '1' : '0';
                }

                SeoSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value === null ? '' : (string) $value]
                );
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'SEO settings updated successfully.',
            'data' => SeoSetting::map(),
        ]);
    }
}
