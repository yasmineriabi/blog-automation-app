"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | boolean;
  autoComplete?: string;
  readOnly?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete = "off",
  readOnly,
  onFocus,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          readOnly={readOnly}
          onFocus={onFocus}
          className={`flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <Eye size={18} />
          ) : (
            <EyeOff size={18} />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-destructive">
          {typeof error === "string" ? error : "This field is required"}
        </p>
      )}
    </div>
  );
} 