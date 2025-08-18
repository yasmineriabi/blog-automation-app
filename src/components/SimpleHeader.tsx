"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/store/auth";
import ProfileDropdown from "./ProfileDropdown";
import BlogFilter from "./BlogFilter";

export default function SimpleHeader() {
  const router = useRouter();
  const { authenticated } = useAuth();

  const handleHome = () => {
    router.push("/dashboard");
  };

  const handleDomainSelect = (domain: string | null) => {
    // This will be handled by the parent component that uses the header
    // For now, we'll just store it in localStorage or pass it through context
    if (domain) {
      localStorage.setItem('selectedDomain', domain);
    } else {
      localStorage.removeItem('selectedDomain');
    }
    // Trigger a page reload or state update to reflect the filter
    window.location.reload();
  };

  // Don't show header on login/signup pages
  if (!authenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Brand Logo - Home Button */}
        <button
          onClick={handleHome}
          className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path
                d="m2 17 10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Blogs Platform</span>
        </button>

        {/* Profile Section with Filter */}
        <div className="flex items-center space-x-3">
          <BlogFilter 
            onDomainSelect={handleDomainSelect}
            selectedDomain={localStorage.getItem('selectedDomain')}
          />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
