import React from "react";
import { Heart, Lightbulb } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-full p-2 border border-white/20 dark:border-gray-800/30">
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "feedback"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "text-gray-300 dark:text-gray-400 hover:text-white"
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Feedback</span>
        </button>
        <button
          onClick={() => setActiveTab("suggestion")}
          className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "suggestion"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "text-gray-300 dark:text-gray-400 hover:text-white"
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          <span>Suggestion</span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
