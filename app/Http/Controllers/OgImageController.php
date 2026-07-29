<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\SeoSetting;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

/**
 * Generates the flat-design fallback OG card for articles with no uploaded
 * image. SVG keeps it dependency-free and a few KB on the wire; the palette
 * matches the site (primary #81263A on the dark #1A222C surface).
 */
class OgImageController extends Controller
{
    private const PRIMARY = '#81263A';
    private const SURFACE = '#1A222C';
    private const SURFACE_ALT = '#24303F';
    private const TEXT = '#FFFFFF';
    private const MUTED = '#AEB7C0';

    private const FONT = 'Poppins, Segoe UI, Helvetica, Arial, sans-serif';

    public function article(string $slug): Response
    {
        $slug = Str::before($slug, '.svg');

        $article = Article::with('category')->where('slug', $slug)->first();

        return $this->render(
            $this->decode($article?->title ?? SeoSetting::get('default_title', 'ivd.my.id')),
            $this->decode($article?->category?->name ?? SeoSetting::get('site_name', 'ivd.my.id'))
        );
    }

    public function default(): Response
    {
        return $this->render(
            SeoSetting::get('default_title', 'ivd.my.id'),
            SeoSetting::get('site_name', 'ivd.my.id')
        );
    }

    private function render(string $title, ?string $eyebrow): Response
    {
        return response($this->buildSvg($title, $eyebrow), 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=604800',
        ]);
    }

    private function buildSvg(string $title, ?string $eyebrow): string
    {
        // 24 chars at 62px stays inside the 1110px content area even for
        // wide-glyph titles (uppercase, "W"/"M" heavy).
        $lines = $this->wrap($title, 24, 3);
        $author = $this->escape(SeoSetting::get('author_name', 'Irvan Denata'));
        $site = $this->escape(SeoSetting::get('site_name', 'ivd.my.id'));
        $font = self::FONT;

        $titleSvg = '';
        $y = 300 - ((count($lines) - 1) * 38);
        foreach ($lines as $line) {
            $titleSvg .= sprintf(
                '<text x="90" y="%d" font-family="%s" font-size="62" font-weight="700" fill="%s">%s</text>',
                $y,
                $font,
                self::TEXT,
                $this->escape($line)
            );
            $y += 76;
        }

        $eyebrowSvg = '';
        if ($eyebrow) {
            $label = $this->escape(Str::upper(Str::limit($eyebrow, 28, '')));
            $width = max(140, mb_strlen($label) * 14 + 44);
            $eyebrowSvg = sprintf(
                '<rect x="90" y="120" width="%d" height="46" rx="23" fill="%s"/>'
                . '<text x="%d" y="151" font-family="%s" font-size="22" font-weight="600" fill="%s" text-anchor="middle" letter-spacing="1.5">%s</text>',
                $width,
                self::PRIMARY,
                (int) (90 + $width / 2),
                $font,
                self::TEXT,
                $label
            );
        }

        $primary = self::PRIMARY;
        $surface = self::SURFACE;
        $surfaceAlt = self::SURFACE_ALT;
        $muted = self::MUTED;
        $aria = $this->escape($title);

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="{$aria}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{$surface}"/>
      <stop offset="100%" stop-color="{$surfaceAlt}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="{$primary}" stroke-opacity="0.10" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <circle cx="1075" cy="105" r="210" fill="{$primary}" fill-opacity="0.14"/>
  <circle cx="120" cy="580" r="160" fill="{$primary}" fill-opacity="0.10"/>
  <rect x="0" y="0" width="14" height="630" fill="{$primary}"/>

  {$eyebrowSvg}
  {$titleSvg}

  <line x1="90" y1="486" x2="440" y2="486" stroke="{$primary}" stroke-width="4" stroke-linecap="round"/>
  <text x="90" y="546" font-family="{$font}" font-size="28" font-weight="600" fill="{$muted}">{$author}</text>
  <text x="1110" y="546" text-anchor="end" font-family="{$font}" font-size="28" font-weight="600" fill="{$primary}">{$site}</text>
</svg>
SVG;
    }

    /**
     * Greedy word wrap, truncating with an ellipsis when the title overflows.
     *
     * @return array<int, string>
     */
    private function wrap(string $text, int $perLine, int $maxLines): array
    {
        $text = trim(preg_replace('/\s+/', ' ', $text) ?? '');
        $words = $text === '' ? [] : explode(' ', $text);

        $lines = [];
        $current = '';
        $overflow = false;

        foreach ($words as $word) {
            $candidate = $current === '' ? $word : $current . ' ' . $word;

            if (mb_strlen($candidate) <= $perLine) {
                $current = $candidate;
                continue;
            }

            if ($current !== '') {
                $lines[] = $current;
                $current = '';
            }

            if (count($lines) >= $maxLines) {
                $overflow = true;
                break;
            }

            // A single word longer than the line gets hard-cut.
            if (mb_strlen($word) > $perLine) {
                $lines[] = mb_substr($word, 0, $perLine - 1) . '…';
                if (count($lines) >= $maxLines) {
                    $overflow = true;
                    break;
                }
                continue;
            }

            $current = $word;
        }

        if ($current !== '' && count($lines) < $maxLines) {
            $lines[] = $current;
        } elseif ($current !== '') {
            $overflow = true;
        }

        if ($lines === []) {
            return [Str::limit($text, $perLine, '') ?: ' '];
        }

        if ($overflow) {
            $last = array_pop($lines);
            $lines[] = rtrim(mb_substr($last, 0, max(1, $perLine - 1))) . '…';
        }

        return $lines;
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    /**
     * Titles come from a WYSIWYG editor and may carry HTML entities
     * (&amp;, &ldquo;); decode first so they are not double-escaped into SVG.
     */
    private function decode(string $value): string
    {
        return html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
}
