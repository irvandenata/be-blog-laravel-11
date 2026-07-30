<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Http\Request;

/**
 * Resolves the "*_en falls back to Indonesian" rule in one place.
 *
 * Locale comes from ?locale=en on the request. A header would be cleaner, but
 * utils/callApi.ts reassigns the whole headers object when an auth token is
 * present, so a custom header would be silently dropped; the query param
 * survives because every service already builds a query string.
 *
 * Anything other than "en" is Indonesian, which is also the fallback whenever a
 * translation is blank — an untranslated article must still render.
 */
trait ResolvesLocale
{
    protected function requestLocale(Request $request): string
    {
        return $request->query('locale') === 'en' ? 'en' : 'id';
    }

    /** True when the value counts as a usable translation. */
    private function isFilled(mixed $value): bool
    {
        return filled(is_string($value) ? trim($value) : $value);
    }

    /**
     * Locale-resolved value for $field, falling back to the Indonesian column.
     * Whitespace-only translations count as missing.
     */
    protected function localized(Request $request, string $field): mixed
    {
        $original = $this->resource->{$field} ?? null;

        if ($this->requestLocale($request) !== 'en') {
            return $original;
        }

        $translated = $this->resource->{"{$field}_en"} ?? null;

        return $this->isFilled($translated) ? $translated : $original;
    }

    /** Locale-resolved values for several fields at once. */
    protected function localizedFields(Request $request, array $fields): array
    {
        $resolved = [];
        foreach ($fields as $field) {
            $resolved[$field] = $this->localized($request, $field);
        }

        return $resolved;
    }

    /** True when EN was asked for and a translation actually exists. */
    protected function hasTranslation(Request $request, string $field): bool
    {
        if ($this->requestLocale($request) !== 'en') {
            return true;
        }

        return $this->isFilled($this->resource->{"{$field}_en"} ?? null);
    }
}
