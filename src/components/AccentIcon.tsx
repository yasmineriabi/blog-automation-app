export default function AccentIcon({ color = "#3b82f6" }: { color?: string }) {
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 7v5l3 3"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      </svg>
    </div>
  );
}
