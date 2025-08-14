
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
    if (loading) return;

    if (!authenticated) {
      setIsAuthenticated(false);
      replace("/login");
      return;
    }

    if (user) {
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
      ) {
        setIsAuthenticated(false);
        replace("/not-authorized");
        return;
      }
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, authenticated, user, pathname]);

  // Show loader while checking authentication
  if (loading || isAuthenticated === null) {
    return <Loader />;
  }

  // Only render children if authenticated and authorized
  return isAuthenticated ? children : null;
}
