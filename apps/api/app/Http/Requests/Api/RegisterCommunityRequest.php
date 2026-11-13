<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterCommunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'email' => mb_strtolower(trim((string) $this->input('email'))),
            'phone' => preg_replace('/[\s()-]/', '', (string) $this->input('phone')),
            'district' => trim((string) $this->input('district')),
        ]);
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone' => ['required', 'string', 'regex:/^(?:\+62|0)8\d{7,11}$/', 'max:20'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'prefer_not_to_say'])],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'district' => ['required', Rule::in(['Karawang Barat', 'Telukjambe Timur', 'Karawang Timur'])],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'consent' => ['accepted'],
        ];
    }
}
