import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  readOnly?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete = 'off',
  readOnly,
  onFocus,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1 text-base font-semibold text-slate-700">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        onFocus={onFocus}
        className={`w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition font-sans text-base bg-white ${error ? 'border-red-400' : ''}`}
        required
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
} 