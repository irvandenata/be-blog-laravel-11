<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'this is api route']);
});

Route::group([
    "prefix" => config('app.api_version'),
], function () {
    Route::get('/', function () {
        return response()->json(['message' => 'this is api route']);
    });


    /**
     * route "/register"
     * @method "POST"
     */
    // Route::post('/register', App\Http\Controllers\Api\RegisterController::class)->name('register');


    Route::group([
        "prefix" => "auth",
    ], function () {
        /**
         * route "/login"
         * @method "POST"
         */
        Route::post('/login', App\Http\Controllers\Api\Auth\LoginController::class)->name('login');
        Route::get('refresh/{token}', [App\Http\Controllers\Api\Auth\LoginController::class,'refresh'])->middleware('api-auth');
        Route::get('logout', [App\Http\Controllers\Api\Auth\LoginController::class,'logout'])->name('logout')->middleware('api-auth');
    });

    Route::get('/data/settings', [App\Http\Controllers\Api\SettingController::class, 'getData'])->name('get-data');
    Route::get('/data/article-categories', [App\Http\Controllers\Api\Article\CategoryController::class, 'index']);
    Route::get('/data/article-tags', [App\Http\Controllers\Api\Article\TagController::class, 'index']);
    Route::get('/data/articles', [App\Http\Controllers\Api\Article\ArticleController::class, 'index']);

    Route::group(["middleware" => ['api-auth']], function () {
        Route::group([
            "prefix" => 'settings',
        ], function () {
            Route::get('/', [App\Http\Controllers\Api\SettingController::class, 'getData'])->name('get-data');
            Route::post('/', [App\Http\Controllers\Api\SettingController::class, 'updateData'])->name('update-data');
        });

        Route::group([
            "prefix" => 'information-types',
        ], function () {
            Route::get('/', [App\Http\Controllers\Api\InformationTypeController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Api\InformationTypeController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\Api\InformationTypeController::class, 'show']);
            Route::patch('/{id}', [App\Http\Controllers\Api\InformationTypeController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Api\InformationTypeController::class, 'destroy']);
        });

        Route::group([
            "prefix" => 'custom-informations',
        ], function () {
            Route::get('/', [App\Http\Controllers\Api\CustomInformationController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Api\CustomInformationController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\Api\CustomInformationController::class, 'show']);
            Route::patch('/{id}', [App\Http\Controllers\Api\CustomInformationController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Api\CustomInformationController::class, 'destroy']);
        });

        Route::group([
            "prefix" => 'article-categories',
        ], function () {
            Route::get('/', [App\Http\Controllers\Api\Article\CategoryController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Api\Article\CategoryController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\Api\Article\CategoryController::class, 'show']);
            Route::patch('/{id}', [App\Http\Controllers\Api\Article\CategoryController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Api\Article\CategoryController::class, 'destroy']);
        });


        Route::group([
            "prefix" => 'article-tags',
        ], function () {
            Route::get('/', [App\Http\Controllers\Api\Article\TagController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Api\Article\TagController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\Api\Article\TagController::class, 'show']);
            Route::patch('/{id}', [App\Http\Controllers\Api\Article\TagController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Api\Article\TagController::class, 'destroy']);
        });


        Route::group([
            "prefix" => 'articles',
        ], function () {
            Route::get('/', [App\Http\Controllers\Api\Article\ArticleController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Api\Article\ArticleController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\Api\Article\ArticleController::class, 'show']);
            Route::patch('/{id}', [App\Http\Controllers\Api\Article\ArticleController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Api\Article\ArticleController::class, 'destroy']);
            Route::post('/{id}/image-upload', [App\Http\Controllers\Api\Article\ArticleController::class, 'storeImage']);
            Route::delete('/{id}/image/{idImage}', [App\Http\Controllers\Api\Article\ArticleController::class, 'deleteImage']);
        });
    });

        // route artisan
        Route::get('/clear-cache', function () {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            return response()->json(['message' => 'cache cleared']);
        });

        Route::get('/migrate', function () {
            Artisan::call('migrate');
            return response()->json(['message' => 'migrate success']);
        });
        Route::get('/seed', function () {
            Artisan::call('db:seed');
            return response()->json(['message' => 'seed success']);
        });
});
