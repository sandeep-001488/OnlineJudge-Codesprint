import React from "react";
import { AlertCircle } from "lucide-react";

const LoginRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center p-6">
      <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-800/30 text-center">
        <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-4">
          Login Required
        </h2>
        <p className="text-gray-300 dark:text-gray-400 mb-6">
          Please login to share your feedback or suggestions with us.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginRequired;
