export const getLastActiveText = (lastActive) => {
  if (!lastActive) return "Unknown";

  const now = new Date();
  const diffInMs = now - new Date(lastActive);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 5) return "Active now";
  if (diffInHours < 1) return `Active ${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `Active ${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Active 1 day ago";
  if (diffInDays < 30) return `Active ${diffInDays} days ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "Active 1 month ago";
  return `Active ${diffInMonths} months ago`;
};

export const getCompletionPercentage = (stats) => {
  if (!stats || stats.totalProblems === 0) return 0;
  return Math.round((stats.problemsSolved / stats.totalProblems) * 100);
};

export const formatSubmissionTime = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString();
};
