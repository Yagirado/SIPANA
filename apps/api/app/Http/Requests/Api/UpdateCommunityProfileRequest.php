<?php

namespace App\Http\Requests\Api;

use App\Models\MasterDataItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCommunityProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'phone' => preg_replace('/[\s()-]/', '', (string) $this->input('phone')),
            'district' => trim((string) $this->input('district')),
        ]);
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\+62|0)8\d{7,11}$/', 'max:20'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'prefer_not_to_say'])],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'district' => ['required', Rule::in(array_values(array_filter([...MasterDataItem::activeKeys('district'), $this->user()?->district])))],
        ];
    }
}
