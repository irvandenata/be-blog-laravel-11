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

    Route::group([
        "prefix" => 'settings',
        "middleware" => ['api-auth']
    ], function () {
        Route::get('/', [App\Http\Controllers\Api\SettingController::class, 'getData'])->name('get-data');
    });


});
