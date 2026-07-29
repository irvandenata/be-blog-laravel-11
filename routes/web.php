<?php

use App\Http\Controllers\FeedController;
use App\Http\Controllers\OgImageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/robots.txt', RobotsController::class);

Route::get('/feed.xml', [FeedController::class, 'rss']);
Route::get('/llms.txt', [FeedController::class, 'llms']);
Route::get('/llms-full.txt', [FeedController::class, 'llmsFull']);

Route::get('/og-default.svg', [OgImageController::class, 'default']);
Route::get('/og/article/{slug}', [OgImageController::class, 'article']);

// SPA shell with server-rendered <head>; must stay last.
Route::get('/{any?}', PageController::class)
    ->where('any', '^(?!api|sitemap\.xml|robots\.txt|feed\.xml|llms\.txt|llms-full\.txt|og/|og-default\.svg|storage/|build/).*$');
