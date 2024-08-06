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
        Route::post('/login', App\Http\Controllers\Api\LoginController::class)->name('login');
    });
});
