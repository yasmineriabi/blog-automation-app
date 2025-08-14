"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page by default
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted">
      <div className="text-center space-y-4">
        <Loader />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
