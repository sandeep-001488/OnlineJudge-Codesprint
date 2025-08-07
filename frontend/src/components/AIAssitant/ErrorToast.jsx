"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, X, Sparkles } from "lucide-react";

const ErrorToast = ({ error, onDebugClick, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [error]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  const handleDebugClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDebugClick();
    }, 300);
  };

  if (!error || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`bg-white dark:bg-slate-800 border-l-4 border-red-500 rounded-lg shadow-2xl p-4 transition-all duration-300 ${
          isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Error Detected
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {error.type === "compilation"
                ? "Compilation error"
                : "Runtime error"}
              : {error.message}
            </p>

            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleDebugClick}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-medium rounded-lg transition-all hover:scale-105"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Debug</span>
              </button>

              <button
                onClick={handleDismiss}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;
