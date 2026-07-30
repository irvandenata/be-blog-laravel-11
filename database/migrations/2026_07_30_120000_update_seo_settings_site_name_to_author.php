<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('seo_settings')->where('key', 'site_name')->update(['value' => 'Irvan Denata']);
        DB::table('seo_settings')->where('key', 'title_template')->update(['value' => '%s | Irvan Denata']);
    }

    public function down(): void
    {
        DB::table('seo_settings')->where('key', 'site_name')->update(['value' => 'ivd.my.id']);
        DB::table('seo_settings')->where('key', 'title_template')->update(['value' => '%s | ivd.my.id']);
    }
};
