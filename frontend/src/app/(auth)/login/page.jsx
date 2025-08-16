"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function LoginPage() {
   const { handleGoogleSignIn, isLoading: googleLoading } = useGoogleAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setRedirectUrl } = useAuthStore();

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      const decodedRedirect = decodeURIComponent(redirectParam);
      setRedirectUrl(decodedRedirect);
    }
  }, [searchParams, setRedirectUrl]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ ...formData, rememberMe });

      const redirectParam = searchParams.get("redirect");
      const redirectTo = redirectParam
        ? decodeURIComponent(redirectParam)
        : useAuthStore.getState().getAndClearRedirectUrl();

      router.push(redirectTo);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      console.error("Login failed:", errorMessage);
    }
  };
   const handleGoogleClick = async () => {
     try {
       setError(""); 
       await handleGoogleSignIn();
     } catch (error) {
       setError("Google authentication failed. Please try again.");
       console.error("Google auth error:", error);
     }
   };

  const redirectParam = searchParams.get("redirect");

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your CodeSprint account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 h-12 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 border-gray-200 dark:border-gray-600"
              >
                <Globe className="h-5 w-5" />
                <span>
                  {googleLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email or Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="identifier"
                    name="identifier"
                    type="identifier"
                    placeholder="Enter email or username"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="relative group">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      Keep me logged in for 15 days
                      <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/reset-password${
                    redirectParam ? `?redirect=${redirectParam}` : ""
                  }`}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                Sign In
              </Button>
            </form>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-600 dark:border-yellow-500 rounded-lg p-4">
                <p className="text-red-600 dark:text-yellow-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href={`/signup${
                    redirectParam ? `?redirect=${redirectParam}` : ""
                  }`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
