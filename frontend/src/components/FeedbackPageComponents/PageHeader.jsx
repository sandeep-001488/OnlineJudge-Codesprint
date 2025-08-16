import React from "react";

const PageHeader = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-4">
        Share Your{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Experience
        </span>
      </h1>
      <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
        Help us improve CodingKaro by sharing your feedback or suggesting new
        features
      </p>
    </div>
  );
};

export default PageHeader;
