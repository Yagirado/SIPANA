<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CommunityController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\UmkmController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/register/community', [RegistrationController::class, 'registerCommunity'])
    ->middleware('throttle:5,1');
Route::post('/register/umkm', [RegistrationController::class, 'registerUmkm'])
    ->middleware('throttle:5,1');
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listingId}', [ListingController::class, 'show'])->whereNumber('listingId');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', [AuthController::class, 'current']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/admin/dashboard', [AuthController::class, 'dashboard'])
        ->middleware('role:'.User::ROLE_ADMIN);

    Route::prefix('/community')->middleware('role:'.User::ROLE_COMMUNITY)->group(function (): void {
        Route::get('/dashboard', [CommunityController::class, 'dashboard']);
        Route::get('/profile', [CommunityController::class, 'profile']);
        Route::put('/profile', [CommunityController::class, 'updateProfile']);
        Route::get('/claims', [CommunityController::class, 'claims']);
        Route::get('/claims/{claimId}', [CommunityController::class, 'claim'])->whereNumber('claimId');
        Route::post('/listings/{listingId}/claim', [CommunityController::class, 'storeClaim'])
            ->whereNumber('listingId')
            ->middleware('throttle:10,1');
        Route::get('/reports', [CommunityController::class, 'reports']);
        Route::post('/reports', [CommunityController::class, 'storeReport'])->middleware('throttle:10,1');
    });

    Route::prefix('/umkm')->middleware('role:'.User::ROLE_UMKM)->group(function (): void {
        Route::get('/dashboard', [UmkmController::class, 'dashboard']);
        Route::get('/profile', [UmkmController::class, 'profile']);
        Route::put('/profile', [UmkmController::class, 'updateProfile']);
        Route::get('/listings', [UmkmController::class, 'listings']);
        Route::get('/listings/{listingId}', [UmkmController::class, 'listing'])->whereNumber('listingId');
        Route::post('/listings', [UmkmController::class, 'storeListing'])->middleware('throttle:10,1');
        Route::put('/listings/{listingId}', [UmkmController::class, 'updateListing'])->whereNumber('listingId');
        Route::delete('/listings/{listingId}', [UmkmController::class, 'withdrawListing'])->whereNumber('listingId');
        Route::get('/claims', [UmkmController::class, 'claims']);
        Route::get('/claims/{claimId}', [UmkmController::class, 'claim'])->whereNumber('claimId');
        Route::post('/claims/{claimId}/handover', [UmkmController::class, 'confirmHandover'])->whereNumber('claimId');
        Route::post('/claims/{claimId}/reports', [UmkmController::class, 'storeClaimReport'])->whereNumber('claimId')->middleware('throttle:5,1');
        Route::get('/impact', [UmkmController::class, 'impact']);
    });

    Route::prefix('/admin')->middleware('role:'.User::ROLE_ADMIN)->group(function (): void {
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/metrics', [AdminController::class, 'metrics']);
        Route::get('/verifications', [AdminController::class, 'verifications']);
        Route::get('/verifications/{applicationId}', [AdminController::class, 'verification'])->whereNumber('applicationId');
        Route::put('/verifications/{applicationId}', [AdminController::class, 'decideVerification'])->whereNumber('applicationId');
        Route::get('/verifications/{applicationId}/document', [AdminController::class, 'verificationDocument'])
            ->whereNumber('applicationId')->name('admin.umkm-verification-document');
    });
});
