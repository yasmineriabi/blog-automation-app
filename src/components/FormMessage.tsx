import React from 'react';

interface FormMessageProps {
  message: string;
  type?: 'error' | 'success';
}

export default function FormMessage({ message, type = 'error' }: FormMessageProps) {
  if (!message) return null;
  return (
    <p className={`text-center text-sm mt-2 ${type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>
  );
} 