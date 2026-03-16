<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'seller';
    }

    public function rules(): array
    {
        return [
            'stock_quantity' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
