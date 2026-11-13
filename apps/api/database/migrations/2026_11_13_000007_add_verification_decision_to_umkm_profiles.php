<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('umkm_profiles', function (Blueprint $table): void {
            $table->text('verification_reason')->nullable()->after('verification_status');
        });
    }

    public function down(): void
    {
        Schema::table('umkm_profiles', function (Blueprint $table): void {
            $table->dropColumn('verification_reason');
        });
    }
};
