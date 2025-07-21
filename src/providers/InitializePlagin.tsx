"use client";

import useAuthStore from "@/store/auth";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";

export default function InitializePlagin() {
  const { initialize } = useAuthStore();

  const hasRendered = useRef(false);
  useEffect(() => {
    if (hasRendered.current) return;
    initialize();

    hasRendered.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "text-xs",
        duration: 3000,
      }}
      reverseOrder={false}
    />
  );
}