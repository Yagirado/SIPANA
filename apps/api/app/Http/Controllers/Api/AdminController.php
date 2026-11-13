<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function verifications(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'verified', 'rejected'])],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
        $users = User::query()->with('umkmProfile')
            ->where('role', User::ROLE_UMKM)
            ->whereHas('umkmProfile')
            ->when($filters['status'] ?? 'pending', function ($query, string $status): void {
                if ($status === 'verified') {
                    $query->whereNotNull('umkm_verified_at');
                } else {
                    $query->whereNull('umkm_verified_at')->whereHas('umkmProfile', fn ($profile) => $profile->where('verification_status', $status));
                }
            })
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(fn ($query) => $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('umkmProfile', fn ($profile) => $profile->where('business_name', 'like', "%{$search}%")));
            })
            ->latest('id')->paginate(20)->withQueryString();
        $users->getCollection()->transform(fn (User $user) => $this->verificationData($user));

        return response()->json($users);
    }

    public function verification(int $applicationId): JsonResponse
    {
        $user = User::query()->with('umkmProfile')->where('role', User::ROLE_UMKM)->findOrFail($applicationId);
        abort_unless($user->umkmProfile, 404, 'Data pengajuan usaha tidak ditemukan.');

        return response()->json($this->verificationData($user, true));
    }

    public function verificationDocument(int $applicationId)
    {
        $user = User::query()->with('umkmProfile')->where('role', User::ROLE_UMKM)->findOrFail($applicationId);
        abort_unless($user->umkmProfile?->business_proof_path, 404, 'Dokumen usaha tidak tersedia.');
        abort_unless(Storage::disk('local')->exists($user->umkmProfile->business_proof_path), 404, 'Berkas dokumen usaha tidak ditemukan.');

        return response()->file(Storage::disk('local')->path($user->umkmProfile->business_proof_path), [
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function decideVerification(Request $request, int $applicationId): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['verified', 'rejected'])],
            'reason' => ['required_if:status,rejected', 'nullable', 'string', 'min:5', 'max:1000'],
        ]);
        $user = User::query()->with('umkmProfile')->where('role', User::ROLE_UMKM)->findOrFail($applicationId);
        abort_unless($user->umkmProfile, 404, 'Data pengajuan usaha tidak ditemukan.');

        DB::transaction(function () use ($user, $data): void {
            $approved = $data['status'] === 'verified';
            $user->forceFill(['umkm_verified_at' => $approved ? now() : null])->save();
            $user->umkmProfile->update([
                'verification_status' => $data['status'],
                'verification_reason' => $approved ? null : $data['reason'],
            ]);
        });

        return response()->json([
            'message' => $data['status'] === 'verified' ? 'UMKM berhasil diverifikasi.' : 'Pengajuan UMKM ditolak dengan alasan yang tercatat.',
            'application' => $this->verificationData($user->fresh('umkmProfile'), true),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', Rule::in(User::ROLES)],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, string $role) => $query->where('role', $role))
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return response()->json($users);
    }

    public function metrics(): JsonResponse
    {
        $roleCounts = User::query()
            ->selectRaw('role, COUNT(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role');

        return response()->json([
            'total_users' => (int) User::query()->count(),
            'users_by_role' => collect(User::ROLES)
                ->mapWithKeys(fn (string $role) => [$role => (int) ($roleCounts[$role] ?? 0)]),
            'new_users_last_30_days' => (int) User::query()
                ->where('created_at', '>=', now()->subDays(30))
                ->count(),
            'generated_at' => now()->toIso8601String(),
        ]);
    }

    /** @return array<string, mixed> */
    private function verificationData(User $user, bool $includeDetails = false): array
    {
        $profile = $user->umkmProfile;
        $data = [
            'id' => $user->id,
            'owner' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'business_name' => $profile?->business_name,
            'business_type' => $profile?->business_type,
            'district' => $user->district,
            'business_address' => $profile?->business_address,
            'status' => $user->umkm_verified_at ? 'verified' : ($profile?->verification_status ?? 'pending'),
            'reason' => $profile?->verification_reason,
            'submitted_at' => $profile?->created_at,
        ];

        if ($includeDetails) {
            $data['document_url'] = route('admin.umkm-verification-document', ['applicationId' => $user->id]);
            $data['verified_at'] = $user->umkm_verified_at;
        }

        return $data;
    }
}
