"use client";
import { useEffect, useCallback } from "react";

import useAuthStore from "@/store/auth";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthStore();

  return <>{loading ? <Loader /> : <Container>{children} </Container>}</>;
}

function Container({ children }: Props) {
  const { push } = useRouter();

  const { authenticated } = useAuthStore();

  const check = useCallback(() => {
    if (authenticated) {
      push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}