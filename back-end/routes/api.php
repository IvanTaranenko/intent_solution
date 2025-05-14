<?php

use App\Http\Controllers\Api\RequestController;
use App\Http\Middleware\AdminTokenMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('/requests', [RequestController::class, 'store']);

Route::middleware([AdminTokenMiddleware::class])->group(function () {
    Route::apiResource('requests', RequestController::class)->except(['store']);
});
