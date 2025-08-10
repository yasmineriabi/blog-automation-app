"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard instead of showing home page
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
