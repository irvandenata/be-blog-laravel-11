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
    });

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
            Route::get('/', [App\Http\Controllers\Api\CustomInformation\InformationTypeController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Api\CustomInformation\InformationTypeController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\Api\CustomInformation\InformationTypeController::class, 'show']);
            Route::patch('/{id}', [App\Http\Controllers\Api\CustomInformation\InformationTypeController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Api\CustomInformation\InformationTypeController::class, 'destroy']);

        });

    });
});
