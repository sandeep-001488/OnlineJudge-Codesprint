"use client";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }) {
  const { isLoading, isHydrated, checkAuth } = useAuthStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [checkAuth]);

  if (!isHydrated || isLoading || isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center z-50">
        <div className="relative">
          {/* Animated background circles */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-150"></div>
          <div className="absolute top-8 -right-8 w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse delay-300"></div>

          {/* Main loading container */}
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="flex flex-col items-center space-y-6">
              {/* Logo/Icon area */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div> */}
              </div>

              {/* Loading spinner */}
              <div className="relative">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 h-8 w-8 border-2 border-blue-200 dark:border-blue-800 rounded-full animate-pulse"></div>
              </div>

              {/* Loading text */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  OJ-Codesprint
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                  Preparing your coding environment...
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
