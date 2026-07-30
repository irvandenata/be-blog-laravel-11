<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The About page reads custom_informations filtered by information type, the
 * same mechanism the tech stack, work experience and social links already use.
 * That type has to exist before the page can be populated from the admin, so it
 * ships as data rather than as a manual setup step.
 */
return new class extends Migration
{
    private const NAME = 'about';

    public function up(): void
    {
        if (DB::table('information_types')->where('name', self::NAME)->exists()) {
            return;
        }

        DB::table('information_types')->insert([
            'name' => self::NAME,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // Only remove the type when nothing depends on it, so a rollback cannot
        // orphan content an author already wrote.
        $id = DB::table('information_types')->where('name', self::NAME)->value('id');

        if ($id && ! DB::table('custom_informations')->where('information_type_id', $id)->exists()) {
            DB::table('information_types')->where('id', $id)->delete();
        }
    }
};
