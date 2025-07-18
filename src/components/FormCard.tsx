import React from 'react';

interface FormCardProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  header?: React.ReactNode;
}

export default function FormCard({ children, icon, header }: FormCardProps) {
  return (
    <div className="w-full max-w-md z-10 transition-all duration-700 bg-white rounded-lg shadow-lg border border-slate-200 p-10 md:p-12 relative">
      {/* Accent Bar */}
      <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-400 rounded-t-lg" />
      {icon && <div className="flex justify-center mt-2 mb-4">{icon}</div>}
      {header && <div className="mb-6">{header}</div>}
      {children}
    </div>
  );
} 