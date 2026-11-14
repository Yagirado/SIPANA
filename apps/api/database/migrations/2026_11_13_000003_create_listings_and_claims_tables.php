<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('business_name', 160);
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('quantity');
            $table->dateTime('prepared_at');
            $table->dateTime('pickup_starts_at');
            $table->dateTime('pickup_ends_at');
            $table->string('purpose', 32);
            $table->string('district', 100)->index();
            $table->text('pickup_address');
            $table->string('photo_path')->nullable();
            $table->timestamp('safety_attested_at');
            $table->string('status', 20)->default('published')->index();
            $table->timestamps();

            $table->index(['status', 'pickup_ends_at']);
        });

        Schema::create('claims', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('listing_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('claimant_id')->constrained('users')->cascadeOnDelete();
            $table->string('status', 20)->default('active')->index();
            $table->timestamp('claimed_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['claimant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
        Schema::dropIfExists('listings');
    }
};
