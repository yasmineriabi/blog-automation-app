"use client";

import type React from "react";

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | boolean;
  autoComplete?: string;
  readOnly?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete = "off",
  readOnly,
  onFocus,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
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
        onBlur={onBlur}
        className={`flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }`}
        required
      />
      {error && (
        <p className="text-sm text-destructive">
          {typeof error === "string" ? error : "This field is required"}
        </p>
      )}
    </div>
  );
}
