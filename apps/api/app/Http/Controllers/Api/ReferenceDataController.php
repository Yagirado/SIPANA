<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\MasterDataItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ReferenceDataController extends Controller
{
    public function index(): JsonResponse
    {
        $active = MasterDataItem::query()->where('is_active', true)->orderBy('sort_order')->orderBy('label')->get();

        return response()->json([
            'districts' => $active->where('type', 'district')->map(fn (MasterDataItem $item) => $this->option($item))->values(),
            'listing_districts' => $active->where('type', 'district')->where('available_for_listings', true)->map(fn (MasterDataItem $item) => $this->option($item))->values(),
            'purposes' => $active->where('type', 'purpose')->map(fn (MasterDataItem $item) => $this->option($item))->values(),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $items = MasterDataItem::query()->orderBy('type')->orderBy('sort_order')->orderBy('label')->get();
        $usage = [
            'district_users' => DB::table('users')->selectRaw('district as item_key, COUNT(*) as total')->groupBy('district')->pluck('total', 'item_key'),
            'district_listings' => DB::table('listings')->selectRaw('district as item_key, COUNT(*) as total')->groupBy('district')->pluck('total', 'item_key'),
            'purposes' => DB::table('listings')->selectRaw('purpose as item_key, COUNT(*) as total')->groupBy('purpose')->pluck('total', 'item_key'),
        ];

        return response()->json($items->map(fn (MasterDataItem $item) => [
            ...$this->option($item),
            'type' => $item->type,
            'sort_order' => $item->sort_order,
            'is_active' => $item->is_active,
            'available_for_listings' => $item->available_for_listings,
            'usage_count' => (int) match ($item->type) {
                'district' => ($usage['district_users'][$item->key] ?? 0) + ($usage['district_listings'][$item->key] ?? 0),
                'purpose' => $usage['purposes'][$item->key] ?? 0,
                default => 0,
            },
        ])->values());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['district', 'purpose'])],
            'label' => ['required', 'string', 'min:2', 'max:120'],
            'available_for_listings' => ['sometimes', 'boolean'],
        ]);
        $key = Str::slug($data['label'], '_');
        $baseKey = $key;
        $suffix = 2;
        while (MasterDataItem::query()->where('type', $data['type'])->where('key', $key)->exists()) {
            $key = $baseKey.'_'.$suffix++;
        }

        $item = DB::transaction(function () use ($request, $data, $key): MasterDataItem {
            $item = MasterDataItem::query()->create([
                ...$data,
                'key' => $key,
                'sort_order' => (int) MasterDataItem::query()->where('type', $data['type'])->max('sort_order') + 1,
                'is_active' => true,
                'available_for_listings' => $data['type'] === 'purpose' || ($data['available_for_listings'] ?? true),
            ]);
            $this->recordAudit($request, 'master_data.created', $item, null, $this->auditValues($item));

            return $item;
        });

        return response()->json(['message' => 'Data master ditambahkan.', 'item' => $item], 201);
    }

    public function update(Request $request, int $itemId): JsonResponse
    {
        $item = MasterDataItem::query()->findOrFail($itemId);
        $data = $request->validate([
            'label' => ['required', 'string', 'min:2', 'max:120'],
            'is_active' => ['required', 'boolean'],
            'available_for_listings' => ['sometimes', 'boolean'],
        ]);
        $before = $this->auditValues($item);

        DB::transaction(function () use ($request, $item, $data, $before): void {
            $item->update([
                ...$data,
                'available_for_listings' => $item->type === 'purpose' ? true : ($data['available_for_listings'] ?? $item->available_for_listings),
            ]);
            $this->recordAudit($request, 'master_data.updated', $item, $before, $this->auditValues($item));
        });

        return response()->json(['message' => 'Data master diperbarui.', 'item' => $item->fresh()]);
    }

    public function destroy(Request $request, int $itemId): JsonResponse
    {
        $item = MasterDataItem::query()->findOrFail($itemId);
        $usageCount = match ($item->type) {
            'district' => DB::table('users')->where('district', $item->key)->count() + DB::table('listings')->where('district', $item->key)->count(),
            'purpose' => DB::table('listings')->where('purpose', $item->key)->count(),
            default => 0,
        };
        abort_if($usageCount > 0, 409, 'Data ini masih dipakai oleh akun atau listing, jadi tidak dapat dihapus. Nonaktifkan jika tidak ingin dipakai lagi.');
        $before = $this->auditValues($item);

        DB::transaction(function () use ($request, $item, $before): void {
            $this->recordAudit($request, 'master_data.deleted', $item, $before, null);
            $item->delete();
        });

        return response()->json(['message' => 'Data master dihapus.']);
    }

    /** @return array{key: string, label: string} */
    private function option(MasterDataItem $item): array
    {
        return ['key' => $item->key, 'label' => $item->label];
    }

    /** @return array<string, mixed> */
    private function auditValues(MasterDataItem $item): array
    {
        return [
            'type' => $item->type,
            'key' => $item->key,
            'label' => $item->label,
            'is_active' => $item->is_active,
            'available_for_listings' => $item->available_for_listings,
        ];
    }

    /** @param array<string, mixed>|null $before
     * @param array<string, mixed>|null $after
     */
    private function recordAudit(Request $request, string $action, MasterDataItem $item, ?array $before, ?array $after): void
    {
        AdminAuditLog::query()->create([
            'admin_id' => $request->user()->id,
            'actor_id' => $request->user()->id,
            'actor_role' => $request->user()->role,
            'actor_name' => $request->user()->name,
            'action' => $action,
            'entity_type' => 'master_data',
            'entity_id' => (string) $item->id,
            'before' => $before,
            'after' => $after,
        ]);
    }
}
