import React from "react";

const InfoSection = ({ activeTab }) => {
  return (
    <div className="mt-8 text-center">
      <div className="bg-white/5 dark:bg-gray-900/20 backdrop-blur-xl rounded-lg p-6 border border-white/10 dark:border-gray-800/20">
        <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-2">
          {activeTab === "feedback" ? "About Feedback" : "About Suggestions"}
        </h3>
        <p className="text-gray-300 dark:text-gray-400 text-sm">
          {activeTab === "feedback"
            ? "Your feedback helps us understand what's working well and may be featured on our homepage to inspire other developers."
            : "Your suggestions drive our roadmap. We carefully review every suggestion and prioritize the most impactful improvements."}
        </p>
      </div>
    </div>
  );
};
export default InfoSection;
