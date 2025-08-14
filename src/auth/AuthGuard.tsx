
"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import Loader from "@/components/Loader";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { authenticated, user, loading } = useAuthStore();
  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // If not authenticated, redirect to login
    if (!authenticated) {
      setIsAuthenticated(false);
      // Only redirect if not already on login page
      if (pathname !== "/login" && pathname !== "/signup") {
        replace("/login");
      }
      return;
    }

    // If authenticated but no user data, wait
    if (authenticated && !user) {
      return;
    }

    // If authenticated and have user data
    if (authenticated && user) {
      // Check role permissions
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        setIsAuthenticated(false);
        replace("/not-authorized");
        return;
      }
      
      // All checks passed
      setIsAuthenticated(true);
    }
  }, [loading, authenticated, user, pathname, replace, allowedRoles]);

  // Show loader while checking authentication
  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted">
        <div className="text-center space-y-4">
          <Loader />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated and authorized
  return isAuthenticated ? children : null;
}
