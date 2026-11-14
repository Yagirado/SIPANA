<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admin_audit_logs', function (Blueprint $table): void {
            $table->foreignId('actor_id')->nullable()->after('admin_id')->constrained('users')->nullOnDelete();
            $table->string('actor_role', 32)->nullable()->after('actor_id');
            $table->index(['actor_role', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('admin_audit_logs', function (Blueprint $table): void {
            $table->dropForeign(['actor_id']);
            $table->dropIndex(['actor_role', 'created_at']);
            $table->dropColumn(['actor_id', 'actor_role']);
        });
    }
};
