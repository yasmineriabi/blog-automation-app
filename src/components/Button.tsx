import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({ children, loading, type = 'button', className }: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-teal-400 text-white font-semibold rounded-md shadow hover:from-teal-400 hover:to-indigo-500 transition text-base flex items-center justify-center ${className || ''}`}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
} 