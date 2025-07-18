"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Code,
  Trophy,
  BookOpen,
  Users,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    isLoggedIn,
    logout,
    checkAuth,
    isInitialized,
    isHydrated:authHydrated,
  } = useAuthStore();

  const {
    theme,
    toggleTheme,
    initializeTheme,
    isHydrated: themeHydrated,
  } = useThemeStore();


  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

 useEffect(() => {
   if (themeHydrated) {
     initializeTheme();
   }
 }, [themeHydrated, initializeTheme]);

  useEffect(() => {
    if (authHydrated && !isInitialized) {
      checkAuth();
    }
  }, [authHydrated, isInitialized, checkAuth]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 dark:border-gray-800 overflow-hidden">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo - positioned at leftmost */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodeJudge
            </span>
          </Link>

          {/* Desktop Navigation - positioned absolutely in center */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/problems"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Problems</span>
            </Link>
            <Link
              href="/contests"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              <Trophy className="h-4 w-4" />
              <span>Contests</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
          </nav>

          {/* Right side actions - positioned at rightmost */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="order-1 md:order-1"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

              <div className="hidden md:flex items-center space-x-2 order-2">
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

         

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden order-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg dark:bg-gray-900/90 border-t dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/problems"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Problems</span>
              </Link>
              <Link
                href="/contests"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                <span>Contests</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>

              {/* Mobile Auth Section */}
                <div className="border-t dark:border-gray-700 pt-2">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <User className="h-4 w-4" />
                        <span>Welcome, {user?.firstName}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="mr-2">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

            
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
