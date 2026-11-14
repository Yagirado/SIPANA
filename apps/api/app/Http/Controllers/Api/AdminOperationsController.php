<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Claim;
use App\Models\Listing;
use App\Models\MasterDataItem;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminOperationsController extends Controller
{
    public function auditLogs(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'entity_type' => ['nullable', 'string', 'max:80'],
        ]);
        $logs = AdminAuditLog::query()
            ->when($filters['entity_type'] ?? null, fn ($query, string $entityType) => $query->where('entity_type', $entityType))
            ->latest('created_at')->latest('id')
            ->paginate(20, ['*'], 'page', $filters['page'] ?? 1)
            ->withQueryString();

        return response()->json($logs);
    }

    public function impact(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'district' => ['nullable', 'string', Rule::exists('master_data_items', 'key')->where('type', 'district')->where('is_active', true)->where('available_for_listings', true)],
        ]);
        $month = $filters['month'] ?? now('Asia/Jakarta')->format('Y-m');
        $localStart = Carbon::createFromFormat('!Y-m', $month, 'Asia/Jakarta');
        $localEnd = $localStart->copy()->endOfMonth();
        $start = $localStart->copy()->utc();
        $end = $localEnd->copy()->utc();
        $district = $filters['district'] ?? null;
        $listings = fn () => Listing::query()->when($district, fn ($query) => $query->where('district', $district));
        $claims = fn () => Claim::query()->whereHas('listing', fn ($query) => $query->when($district, fn ($query) => $query->where('district', $district)));
        $completedPortions = fn ($from, $to) => DB::table('claims')
            ->join('listings', 'claims.listing_id', '=', 'listings.id')
            ->where('claims.status', Claim::STATUS_COMPLETED)
            ->whereBetween('claims.completed_at', [$from, $to])
            ->when($district, fn ($query) => $query->where('listings.district', $district));

        $weeklyPortions = collect();
        $cursor = $localStart->copy();
        $week = 1;
        while ($cursor->lte($localEnd)) {
            $weekEnd = $cursor->copy()->addDays(6)->endOfDay()->min($localEnd);
            $weeklyPortions->push([
                'week' => $week++,
                'from' => $cursor->toDateString(),
                'to' => $weekEnd->toDateString(),
                'portions' => (int) ($completedPortions($cursor->copy()->utc(), $weekEnd->copy()->utc())->sum('listings.quantity') ?? 0),
            ]);
            $cursor = $weekEnd->copy()->addSecond()->startOfDay();
        }

        $districtBreakdown = $completedPortions($start, $end)
            ->selectRaw('listings.district as district, COUNT(claims.id) as handovers, SUM(listings.quantity) as portions')
            ->groupBy('listings.district')->orderBy('listings.district')->get()
            ->map(fn ($row) => [
                'key' => $row->district,
                'label' => MasterDataItem::query()->where('type', 'district')->where('key', $row->district)->value('label') ?? $row->district,
                'handovers' => (int) $row->handovers,
                'portions' => (int) $row->portions,
            ])->values();

        return response()->json([
            'month' => $month,
            'district' => $district,
            'published_listings' => $listings()->whereBetween('created_at', [$start, $end])->count(),
            'claims' => $claims()->whereBetween('claimed_at', [$start, $end])->count(),
            'completed_handovers' => (int) $completedPortions($start, $end)->count('claims.id'),
            'portions_distributed' => (int) ($completedPortions($start, $end)->sum('listings.quantity') ?? 0),
            'weekly_portions' => $weeklyPortions,
            'district_breakdown' => $districtBreakdown,
        ]);
    }

    public function exportImpact(Request $request)
    {
        $filters = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'district' => ['nullable', 'string', Rule::exists('master_data_items', 'key')->where('type', 'district')->where('is_active', true)->where('available_for_listings', true)],
        ]);
        $month = $filters['month'] ?? now('Asia/Jakarta')->format('Y-m');
        $localStart = Carbon::createFromFormat('!Y-m', $month, 'Asia/Jakarta');
        $localEnd = $localStart->copy()->endOfMonth();
        $start = $localStart->copy()->utc();
        $end = $localEnd->copy()->utc();
        $district = $filters['district'] ?? null;
        $exportedAt = now();
        $districtLabels = MasterDataItem::query()->where('type', 'district')->pluck('label', 'key');
        $purposeLabels = MasterDataItem::query()->where('type', 'purpose')->pluck('label', 'key');

        $listings = Listing::query()->with('claim')
            ->where(function ($query) use ($start, $end): void {
                $query->whereBetween('created_at', [$start, $end])
                    ->orWhereHas('claim', fn ($claim) => $claim->where(fn ($activity) => $activity->whereBetween('claimed_at', [$start, $end])
                        ->orWhere(fn ($completed) => $completed->where('status', Claim::STATUS_COMPLETED)->whereBetween('completed_at', [$start, $end]))));
            })
            ->when($district, fn ($query) => $query->where('district', $district))
            ->orderBy('district')->orderBy('id');

        return response()->streamDownload(function () use ($listings, $start, $end, $month, $districtLabels, $purposeLabels, $exportedAt): void {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, [
                'Periode', 'ID listing', 'Nama usaha', 'Judul listing', 'Kecamatan', 'Peruntukan', 'Status listing',
                'Dibuat pada', 'Klaim dibuat periode ini', 'Serah terima selesai periode ini', 'Porsi tersalurkan periode ini',
                'Waktu klaim', 'Waktu serah terima selesai', 'Diekspor pada',
            ]);

            foreach ($listings->lazy(500) as $listing) {
                $claim = $listing->claim;
                $claimInPeriod = $claim?->claimed_at && $claim->claimed_at->gte($start) && $claim->claimed_at->lte($end);
                $handoverInPeriod = $claim?->status === Claim::STATUS_COMPLETED
                    && $claim->completed_at && $claim->completed_at->gte($start) && $claim->completed_at->lte($end);
                fputcsv($output, [
                    $month,
                    $listing->id,
                    $this->csvCell($listing->business_name),
                    $this->csvCell($listing->title),
                    $this->csvCell($districtLabels[$listing->district] ?? $listing->district),
                    $this->csvCell($purposeLabels[$listing->purpose] ?? $listing->purpose),
                    $listing->status,
                    $listing->created_at?->toDateTimeString(),
                    $claimInPeriod ? 1 : 0,
                    $handoverInPeriod ? 1 : 0,
                    $handoverInPeriod ? $listing->quantity : 0,
                    $claimInPeriod ? $claim->claimed_at?->toDateTimeString() : '',
                    $handoverInPeriod ? $claim->completed_at?->toDateTimeString() : '',
                    $exportedAt->toDateTimeString(),
                ]);
            }

            fclose($output);
        }, 'rekap-dampak-'.$month.($district ? '-'.$district : '').'.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function csvCell(?string $value): string
    {
        $value ??= '';

        return preg_match('/^[\s]*[=+\-@]/u', $value) === 1 ? "'".$value : $value;
    }
}
