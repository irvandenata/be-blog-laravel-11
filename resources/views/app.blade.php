@php
    $meta = $meta ?? [];
    $crawlerContent = $crawlerContent ?? [];
    $locale = $meta['locale'] ?? 'id_ID';
@endphp
<!doctype html>
<html lang="{{ str_replace('_', '-', $locale) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Paint the page dark before first paint so there is no light flash.
             Kept inline and tiny: an external file would block or flicker. --}}
        <script>
            (function () {
                try {
                    var stored = localStorage.getItem('color-theme');
                    var theme = stored ? JSON.parse(stored) : 'dark';
                    document.documentElement.classList.toggle('dark', theme !== 'light');
                } catch (e) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        <style>
            :root { color-scheme: dark; }
            html.dark { background-color: #1a222c; }
            html:not(.dark) { background-color: #ffffff; color-scheme: light; }
            body { margin: 0; }
        </style>

        <title>{{ $meta['title'] ?? config('app.name') }}</title>
        <meta name="description" content="{{ $meta['description'] ?? '' }}">
        @if (!empty($meta['keywords']))
            <meta name="keywords" content="{{ $meta['keywords'] }}">
        @endif
        <meta name="robots" content="{{ $meta['robots'] ?? 'index, follow' }}">
        <meta name="googlebot" content="{{ $meta['robots'] ?? 'index, follow' }}">
        <link rel="canonical" href="{{ $meta['canonical'] ?? url()->current() }}">
        @if (!empty($meta['author']))
            <meta name="author" content="{{ $meta['author'] }}">
        @endif

        {{-- Open Graph --}}
        <meta property="og:type" content="{{ $meta['type'] ?? 'website' }}">
        <meta property="og:title" content="{{ $meta['title'] ?? '' }}">
        <meta property="og:description" content="{{ $meta['description'] ?? '' }}">
        <meta property="og:url" content="{{ $meta['canonical'] ?? url()->current() }}">
        <meta property="og:site_name" content="{{ $meta['site_name'] ?? '' }}">
        <meta property="og:locale" content="{{ $locale }}">
        <meta property="og:image" content="{{ $meta['image'] ?? '' }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $meta['title'] ?? '' }}">
        @if (($meta['type'] ?? '') === 'article')
            @if (!empty($meta['published_time']))
                <meta property="article:published_time" content="{{ $meta['published_time'] }}">
            @endif
            @if (!empty($meta['modified_time']))
                <meta property="article:modified_time" content="{{ $meta['modified_time'] }}">
            @endif
            @if (!empty($meta['author']))
                <meta property="article:author" content="{{ $meta['author'] }}">
            @endif
            @if (!empty($meta['section']))
                <meta property="article:section" content="{{ $meta['section'] }}">
            @endif
            @foreach ($meta['tags'] ?? [] as $tag)
                <meta property="article:tag" content="{{ $tag }}">
            @endforeach
        @endif

        {{-- Twitter / X --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $meta['title'] ?? '' }}">
        <meta name="twitter:description" content="{{ $meta['description'] ?? '' }}">
        <meta name="twitter:image" content="{{ $meta['image'] ?? '' }}">
        @if (!empty($meta['twitter_handle']))
            <meta name="twitter:site" content="{{ $meta['twitter_handle'] }}">
            <meta name="twitter:creator" content="{{ $meta['twitter_handle'] }}">
        @endif

        @if (!empty($meta['google_verification']))
            <meta name="google-site-verification" content="{{ $meta['google_verification'] }}">
        @endif
        @if (!empty($meta['bing_verification']))
            <meta name="msvalidate.01" content="{{ $meta['bing_verification'] }}">
        @endif

        {{-- JSON-LD: the primary signal for both rich results and LLM ingestion. --}}
        @foreach ($meta['structured_data'] ?? [] as $schema)
            <script type="application/ld+json">{!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
        @endforeach

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#1a222c">
        <link rel="alternate" type="application/rss+xml" title="{{ $meta['site_name'] ?? '' }}" href="/feed.xml">
        <link rel="sitemap" type="application/xml" href="/sitemap.xml">

        {{-- hreflang: both locales serve the same route tree, /en prefixed. --}}
        @foreach ($meta['alternates'] ?? [] as $hreflang => $href)
            <link rel="alternate" hreflang="{{ $hreflang }}" href="{{ $href }}">
        @endforeach

        <link rel="preconnect" href="{{ config('app.url') }}">
        @if (!empty($meta['prefetch']))
            <link rel="preload" as="fetch" href="{{ $meta['prefetch'] }}" crossorigin>
        @endif

        @viteReactRefresh
        @vite('resources/js/main.tsx')
    </head>
    <body>
        <div id="root"></div>

        @if (!empty($crawlerContent))
            {{-- Same substance the SPA renders; present for non-JS crawlers. --}}
            <noscript>
                <main>
                    <h1>{{ $crawlerContent['heading'] }}</h1>
                    @if (!empty($crawlerContent['intro']))
                        <p>{{ $crawlerContent['intro'] }}</p>
                    @endif
                    @if (!empty($crawlerContent['body']))
                        <article>{!! $crawlerContent['body'] !!}</article>
                    @endif
                    @if (!empty($crawlerContent['links']))
                        <ul>
                            @foreach ($crawlerContent['links'] as $link)
                                <li>
                                    <a href="{{ $link['url'] }}">{{ $link['title'] }}</a>
                                    @if (!empty($link['category'])) — {{ $link['category'] }} @endif
                                    @if (!empty($link['date'])) ({{ $link['date'] }}) @endif
                                </li>
                            @endforeach
                        </ul>
                    @endif
                </main>
            </noscript>
        @endif
    </body>
</html>
