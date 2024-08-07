<?php

namespace App\Http\Requests\InformationType;

use Illuminate\Foundation\Http\FormRequest;

class StoreInformationTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // 'photo' => ['nullable', 'string'],
            // 'employee_number' => ['nullable', 'string'],
            
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            // 'email.unique' => 'Email you entered already exists. Please try with another one.',
            // 'dateofbirth.before' => 'The employee must be a minimum of 17 years old.'
        ];
    }
}
