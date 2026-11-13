<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('gender', 24)->nullable()->after('phone');
            $table->date('birth_date')->nullable()->after('gender');
            $table->string('district', 100)->nullable()->after('birth_date');
            $table->timestamp('privacy_consent_at')->nullable()->after('district');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['phone', 'gender', 'birth_date', 'district', 'privacy_consent_at']);
        });
    }
};
