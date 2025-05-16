<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'registration_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('students')->ignore($this->student->id),
            ],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('students')->ignore($this->student->id),
            ],
            'is_first_year' => ['required', 'boolean'],
            'department_id' => ['required', 'exists:departments,id'],
            'student_group_id' => ['required', 'exists:student_groups,id'],
            'subject_ids' => ['required', 'array'],
            'subject_ids.*' => ['exists:subjects,id'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $validator->getData();

            // If student is first year, ensure they have selected between 3 and 5 subjects
            if (isset($data['is_first_year']) && $data['is_first_year'] === true) {
                $subjectCount = count($data['subject_ids'] ?? []);

                if ($subjectCount < 3) {
                    $validator->errors()->add('subject_ids', 'First-year students must select at least 3 subjects.');
                }

                if ($subjectCount > 5) {
                    $validator->errors()->add('subject_ids', 'First-year students can select a maximum of 5 subjects.');
                }
            }
        });
    }
}
