import type React from "react";

interface FormCardProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  header?: React.ReactNode;
}

export default function FormCard({ children, icon, header }: FormCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-background border border-border rounded-2xl shadow-lg p-8 space-y-6">
        {icon && <div className="flex justify-center">{icon}</div>}
        {header && <div className="text-center space-y-2">{header}</div>}
        {children}
      </div>
    </div>
  );
}
