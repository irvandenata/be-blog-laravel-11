<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        $baseUrl = rtrim(env('APP_URL', 'https://ivd.my.id'), '/');

        $defaults = [
            'site_name' => 'Irvan Denata',
            'site_url' => $baseUrl,
            'default_title' => 'Irvan Denata — Fullstack Engineer',
            'title_template' => '%s | Irvan Denata',
            'default_description' => 'Personal blog and portfolio — articles about software engineering, technology, and the ideas that stopped by in my head.',
            'default_keywords' => 'software engineering, web development, laravel, react, programming, blog',
            'default_og_image' => '',
            'twitter_handle' => '',
            'author_name' => 'Irvan Denata',
            'author_url' => $baseUrl,
            'locale' => 'id_ID',
            'robots_default' => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'google_site_verification' => '',
            'bing_site_verification' => '',
            'blog_title' => 'Articles & Blog',
            'blog_description' => 'Browse articles and blog posts about software engineering, technology, and more.',
            'ai_crawlers_allowed' => '1',
        ];

        $now = now();

        DB::table('seo_settings')->insert(
            collect($defaults)
                ->map(fn ($value, $key) => [
                    'key' => $key,
                    'value' => $value,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->values()
                ->all()
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
    }
};
