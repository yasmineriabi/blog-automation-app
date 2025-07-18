import React from 'react';

export default function AccentIcon({ color = '#6366F1' }: { color?: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mb-2" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="5" fill={color} fillOpacity="0.12" />
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
} 