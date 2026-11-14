<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\Api\ListingController;

Schedule::call(fn (): mixed => app(ListingController::class)->expireDueRecords())
    ->everyMinute()
    ->name('expire-due-listings')
    ->withoutOverlapping();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
