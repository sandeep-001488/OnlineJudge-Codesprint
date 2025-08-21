"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function RequestPasswordResetPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!identifier.trim()) {
      setError("Please enter your email or username");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/request-password-reset`,
        { identifier: identifier.trim() },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setIsSuccess(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                We've sent a password reset link to your registered email
                address.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  <strong>Didn't receive the email?</strong>
                  <br />
                  • Check your spam mail
                  <br />
                  • Make sure you entered the correct email or username
                  <br />
                  • The link expires in 15 minutes
                  <br />• Wait a few minutes before trying again
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setIdentifier("");
                    setError("");
                  }}
                  variant="outline"
                  className="w-full h-12"
                >
                  Didn't receive the mail? Re-try
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-8 relative">
            <Link
              href="/login"
              className="absolute left-6 top-6 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email or username and we'll send you a reset link
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
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
                    type="text"
                    placeholder="Enter your email or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We'll send the reset link to your registered email address
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Back to Login
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
