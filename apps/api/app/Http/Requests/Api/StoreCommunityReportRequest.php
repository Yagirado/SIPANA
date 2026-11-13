<?php

namespace App\Http\Requests\Api;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCommunityReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'listing_id' => ['nullable', 'integer', 'exists:listings,id'],
            'claim_id' => ['nullable', 'integer', 'exists:claims,id'],
            'category' => ['required', Rule::in(Report::CATEGORIES)],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $hasListing = $this->filled('listing_id');
            $hasClaim = $this->filled('claim_id');

            if ($hasListing === $hasClaim) {
                $validator->errors()->add('listing_id', 'Pilih satu listing atau klaim yang ingin dilaporkan.');
            }
        }];
    }
}
