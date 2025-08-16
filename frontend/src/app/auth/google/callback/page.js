"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState("Processing Google authentication...");
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          const decodedError = decodeURIComponent(
            errorDescription || errorParam
          );
          throw new Error(`Google OAuth Error: ${decodedError}`);
        }

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
          throw new Error("No authorization code received from Google");
        }

        console.log(
          "Received authorization code:",
          code.substring(0, 10) + "..."
        );
        setStatus("Exchanging code for tokens...");

        const redirectUri = `${window.location.origin}/auth/google/callback`;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}auth/google/callback`,
          {
            code,
            redirect_uri: redirectUri,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("Backend response:", response.data);

        if (!response.data.success) {
          throw new Error(response.data.message || "Authentication failed");
        }

        const { user, accessToken, refreshToken } = response.data;

        if (!user || !accessToken) {
          throw new Error("Invalid response from server");
        }

        setStatus("Logging you in...");

        useAuthStore.getState();

        const normalizedUser = {
          ...user,
          _id: user._id || user.id,
          id: user.id || user._id,
        };

        useAuthStore.setState({
          user: normalizedUser,
          token: accessToken,
          refreshToken,
          isLoggedIn: true,
          rememberMe: false,
          error: null,
          isLoading: false,
        });

        setStatus("Success! Redirecting...");

        const savedRedirect = localStorage.getItem("google_auth_redirect");
        localStorage.removeItem("google_auth_redirect");

        const redirectTo = savedRedirect
          ? decodeURIComponent(savedRedirect)
          : "/";

        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } catch (error) {
        console.error("Google callback error:", error);

        let errorMessage = "Authentication failed";

        if (error.response) {
          const backendError = error.response.data;
          errorMessage =
            backendError.message || `Server error: ${error.response.status}`;
          console.error("Backend error details:", backendError);
        } else if (error.request) {
          errorMessage = "Network error - please check your connection";
        } else {
          errorMessage = error.message;
        }

        setError(errorMessage);
        setStatus("Authentication failed");

        setTimeout(() => {
          const redirectParam = searchParams.get("redirect");
          const loginUrl = redirectParam
            ? `/login?redirect=${encodeURIComponent(redirectParam)}`
            : "/login";
          router.push(loginUrl);
        }, 5000);
      }
    };

    if (searchParams.toString()) {
      handleCallback();
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="mb-4">
          {error ? (
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Google Authentication
        </h2>

        <p className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
          {status}
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
            <div className="mt-2 text-xs text-red-500">
              Redirecting to login page in 5 seconds...
            </div>
          </div>
        )}

        {!error && (
          <div className="mt-4 text-xs text-gray-500">
            Please wait while we complete your authentication...
          </div>
        )}
      </div>
    </div>
  );
}
