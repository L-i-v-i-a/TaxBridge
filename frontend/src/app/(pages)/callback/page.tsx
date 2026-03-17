"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. The main content component that uses useSearchParams
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const isAdmin = searchParams.get("isAdmin");

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      if (isAdmin === "true") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/signin");
    }
  }, [searchParams, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Logging you in...</p>
    </div>
  );
}

// 2. The default export wraps the content in Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}