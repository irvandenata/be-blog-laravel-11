<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * English translations live alongside the Indonesian originals rather than in a
 * separate translations table: there are exactly two locales, and every read
 * needs both columns in the same row to resolve the "fall back to Indonesian"
 * rule without a join.
 *
 * All nullable — an untranslated article is the normal case, not an error.
 * Lengths mirror the Indonesian columns added in add_seo_fields_to_articles.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->text('content_en')->nullable()->after('content');
            $table->string('meta_description_en', 160)->nullable()->after('meta_description');
            $table->string('meta_keywords_en', 255)->nullable()->after('meta_keywords');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn([
                'title_en',
                'content_en',
                'meta_description_en',
                'meta_keywords_en',
            ]);
        });
    }
};
