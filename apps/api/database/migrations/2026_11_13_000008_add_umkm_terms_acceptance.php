<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('umkm_profiles', function (Blueprint $table): void {
            $table->timestamp('terms_accepted_at')->nullable()->after('verification_reason');
            $table->string('terms_version', 24)->nullable()->after('terms_accepted_at');
        });
    }

    public function down(): void
    {
        Schema::table('umkm_profiles', function (Blueprint $table): void {
            $table->dropColumn(['terms_accepted_at', 'terms_version']);
        });
    }
};
