<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_data_items', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 32);
            $table->string('key', 80);
            $table->string('label', 120);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('available_for_listings')->default(true);
            $table->timestamps();
            $table->unique(['type', 'key']);
            $table->index(['type', 'is_active', 'sort_order']);
        });

        $districts = [
            ['type' => 'district', 'key' => 'karawang_barat', 'label' => 'Karawang Barat', 'sort_order' => 1, 'available_for_listings' => true],
            ['type' => 'district', 'key' => 'telukjambe_timur', 'label' => 'Telukjambe Timur', 'sort_order' => 2, 'available_for_listings' => true],
            ['type' => 'district', 'key' => 'karawang_timur', 'label' => 'Karawang Timur', 'sort_order' => 3, 'available_for_listings' => true],
            ['type' => 'district', 'key' => 'other', 'label' => 'Lainnya', 'sort_order' => 4, 'available_for_listings' => false],
        ];
        $purposes = [
            ['type' => 'purpose', 'key' => 'consumption', 'label' => 'Untuk konsumsi', 'sort_order' => 1, 'available_for_listings' => true],
            ['type' => 'purpose', 'key' => 'redistribution', 'label' => 'Redistribusi', 'sort_order' => 2, 'available_for_listings' => true],
            ['type' => 'purpose', 'key' => 'animal_feed', 'label' => 'Pakan ternak', 'sort_order' => 3, 'available_for_listings' => true],
        ];
        $now = now();
        DB::table('master_data_items')->insert(array_map(
            static fn (array $item): array => [...$item, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            [...$districts, ...$purposes],
        ));

        foreach (array_slice($districts, 0, 3) as $district) {
            DB::table('users')->where('district', $district['label'])->update(['district' => $district['key']]);
            DB::table('listings')->where('district', $district['label'])->update(['district' => $district['key']]);
        }
        DB::table('users')->where('district', 'Lainnya')->update(['district' => 'other']);
    }

    public function down(): void
    {
        foreach ([
            'karawang_barat' => 'Karawang Barat',
            'telukjambe_timur' => 'Telukjambe Timur',
            'karawang_timur' => 'Karawang Timur',
            'other' => 'Lainnya',
        ] as $key => $label) {
            DB::table('users')->where('district', $key)->update(['district' => $label]);
            DB::table('listings')->where('district', $key)->update(['district' => $label]);
        }

        Schema::dropIfExists('master_data_items');
    }
};
