<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\RegisterCommunityRequest;
use App\Http\Requests\Api\RegisterUmkmRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class RegistrationController extends Controller
{
    public function registerUmkm(RegisterUmkmRequest $request): JsonResponse
    {
        $data = $request->validated();
        $proofPath = $request->file('business_proof')->store('umkm/business-proofs', 'b2-documents');

        if (! $proofPath) {
            return response()->json(['message' => 'Foto usaha gagal disimpan. Coba unggah kembali.'], 500);
        }

        try {
            $user = DB::transaction(function () use ($data, $proofPath): User {
                $user = User::create([
                    'name' => $data['owner'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'district' => $data['district'],
                    'password' => $data['password'],
                ]);

                $user->forceFill(['role' => User::ROLE_UMKM])->save();
                $user->umkmProfile()->create([
                    'business_name' => $data['business'],
                    'business_type' => $data['businessType'],
                    'business_address' => $data['address'],
                    'business_proof_path' => $proofPath,
                ]);

                return $user;
            });
        } catch (Throwable $exception) {
            Storage::disk('b2-documents')->delete($proofPath);
            throw $exception;
        }

        return response()->json([
            'message' => 'Akun UMKM berhasil dibuat. Silakan masuk menggunakan email dan kata sandi. Profil usaha menunggu verifikasi admin.',
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'verification_status' => 'pending',
        ], 201);
    }

    public function registerCommunity(RegisterCommunityRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'gender' => $data['gender'] ?? null,
                'birth_date' => $data['birth_date'] ?? null,
                'district' => $data['district'],
                'password' => $data['password'],
                'privacy_consent_at' => now(),
            ]);

            $user->forceFill(['role' => User::ROLE_COMMUNITY])->save();

            return $user;
        });

        return response()->json([
            'message' => 'Pendaftaran akun berhasil.',
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ], 201);
    }
}
