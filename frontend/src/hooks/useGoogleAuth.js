"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(
          window.location.origin + "/auth/google/callback"
        )}&` +
        `response_type=code&` +
        `scope=email profile&` +
        `access_type=offline&` +
        `prompt=select_account`;

      const redirectParam = searchParams.get("redirect");
      if (redirectParam) {
        localStorage.setItem("google_auth_redirect", redirectParam);
      }

      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    handleGoogleSignIn,
    isLoading,
  };
}
