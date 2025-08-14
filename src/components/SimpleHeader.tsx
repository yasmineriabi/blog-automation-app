"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/store/auth";
import Button from "./Button";

export default function SimpleHeader() {
  const router = useRouter();
  const { logout, authenticated } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleHome = () => {
    router.push("/dashboard");
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

        {/* Logout Button */}
        <Button onClick={handleLogout} variant="destructive" size="sm">
          Logout
        </Button>
      </div>
    </header>
  );
}
