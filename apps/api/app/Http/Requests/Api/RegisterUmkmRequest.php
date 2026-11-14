<?php

namespace App\Http\Requests\Api;

use App\Models\MasterDataItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterUmkmRequest extends FormRequest
{
    private const BUSINESS_TYPES = [
        'Warung makan',
        'Toko roti dan kue',
        'Katering',
        'Kedai minuman',
        'Lainnya',
    ];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'owner' => trim((string) $this->input('owner')),
            'email' => mb_strtolower(trim((string) $this->input('email'))),
            'phone' => preg_replace('/[\s()-]/', '', (string) $this->input('phone')),
            'business' => trim((string) $this->input('business')),
            'address' => trim((string) $this->input('address')),
            'district' => trim((string) $this->input('district')),
        ]);
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'owner' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone' => ['required', 'string', 'regex:/^(?:\+62|0)8\d{7,11}$/', 'max:20'],
            'business' => ['required', 'string', 'min:2', 'max:160'],
            'businessType' => ['required', Rule::in(self::BUSINESS_TYPES)],
            'district' => ['required', Rule::in(MasterDataItem::activeKeys('district', true))],
            'address' => ['required', 'string', 'min:5', 'max:1000'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'business_proof' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
