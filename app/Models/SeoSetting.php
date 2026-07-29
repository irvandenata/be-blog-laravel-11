<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SeoSetting extends Model
{
    protected $guarded = [];

    public const CACHE_KEY = 'seo_settings_all';

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * All settings as a flat key => value map, cached until a row changes.
     */
    public static function map(): array
    {
        return Cache::rememberForever(
            self::CACHE_KEY,
            fn () => static::query()->pluck('value', 'key')->all()
        );
    }

    public static function get(string $key, ?string $fallback = null): ?string
    {
        $value = self::map()[$key] ?? null;

        return ($value === null || $value === '') ? $fallback : $value;
    }
}
