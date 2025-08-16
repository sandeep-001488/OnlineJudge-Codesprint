import React from "react";

const UserCard = ({
  user,
  gradientFrom = "blue-500",
  gradientTo = "purple-500",
}) => {
  return (
    <div className="bg-white/5 dark:bg-gray-800/20 rounded-lg p-4 flex items-center space-x-3">
      <div
        className={`w-12 h-12 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-full flex items-center justify-center text-white font-bold text-lg`}
      >
        {user?.username?.[0]?.toUpperCase() || "U"}
      </div>
      <div>
        <div className="text-white dark:text-gray-100 font-medium">
          {user.username}
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
