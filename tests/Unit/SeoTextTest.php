<?php

namespace Tests\Unit;

use App\Http\Controllers\OgImageController;
use App\Services\PageMetaService;
use PHPUnit\Framework\TestCase;
use ReflectionMethod;

/**
 * Covers the text-mangling helpers behind SEO output: entity decoding,
 * word-boundary truncation, and OG-card title wrapping. These run on every
 * page render, and a regression here silently corrupts meta tags.
 */
class SeoTextTest extends TestCase
{
    private function call(object $object, string $method, array $args)
    {
        // Private methods are reflected directly; PHP 8.1+ makes them
        // invokable without setAccessible().
        return (new ReflectionMethod($object, $method))->invokeArgs($object, $args);
    }

    public function test_plain_text_strips_tags_and_decodes_entities(): void
    {
        $result = $this->call(new PageMetaService(), 'plainText', [
            '<p>Hello&nbsp;&ldquo;world&rdquo;</p><p>Second &amp; last</p>',
        ]);

        $this->assertStringNotContainsString('<', $result);
        $this->assertStringNotContainsString('&nbsp;', $result);
        $this->assertStringNotContainsString('&amp;', $result);
        $this->assertStringContainsString('Second & last', $result);
    }

    public function test_truncate_cuts_on_word_boundary(): void
    {
        $result = $this->call(new PageMetaService(), 'truncateOnWord', [
            'the quick brown fox jumps over the lazy dog',
            20,
        ]);

        $this->assertSame('the quick brown fox…', $result);
    }

    public function test_truncate_leaves_short_text_untouched(): void
    {
        $result = $this->call(new PageMetaService(), 'truncateOnWord', [
            'short text',
            160,
        ]);

        $this->assertSame('short text', $result);
    }

    public function test_truncate_hard_cuts_a_single_long_word(): void
    {
        // No space to break on, so it must still respect the limit.
        $result = $this->call(new PageMetaService(), 'truncateOnWord', [
            str_repeat('a', 50),
            10,
        ]);

        $this->assertLessThanOrEqual(11, mb_strlen($result));
        $this->assertStringEndsWith('…', $result);
    }

    public function test_og_wrap_respects_line_and_count_limits(): void
    {
        $lines = $this->call(new OgImageController(), 'wrap', [
            'Aplikasi Website Rekomendasi Laptop dengan Menerapkan Algoritma Fuzzy',
            24,
            3,
        ]);

        $this->assertLessThanOrEqual(3, count($lines));
        foreach ($lines as $line) {
            $this->assertLessThanOrEqual(24, mb_strlen($line), "Line too long: {$line}");
        }
    }

    public function test_og_wrap_marks_truncation_when_title_overflows(): void
    {
        $lines = $this->call(new OgImageController(), 'wrap', [
            str_repeat('word ', 60),
            24,
            3,
        ]);

        $this->assertCount(3, $lines);
        $this->assertStringEndsWith('…', end($lines));
    }

    public function test_og_wrap_handles_short_title_without_ellipsis(): void
    {
        $lines = $this->call(new OgImageController(), 'wrap', ['Dua 5 Tahun', 24, 3]);

        $this->assertSame(['Dua 5 Tahun'], $lines);
    }
}
