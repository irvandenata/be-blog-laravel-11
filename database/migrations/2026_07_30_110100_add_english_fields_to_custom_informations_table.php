<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Same two-columns-per-locale approach as articles. custom_informations backs
 * the work-experience list, tech stack, social links and — after this — the
 * About page, so its prose fields need an English counterpart.
 *
 * Only title and description are translated. `subtitle` is deliberately left
 * alone: it doubles as a machine key ("frontend"/"backend"/"others") that the
 * tech-stack query and grouping match on, so a translated copy would break
 * that filter. icon/image/link/dates are locale-independent too.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_informations', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->text('description_en')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('custom_informations', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'description_en']);
        });
    }
};
