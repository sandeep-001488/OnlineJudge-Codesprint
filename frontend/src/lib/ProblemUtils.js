export const getDifficultyColor = (difficulty, theme) => {
  const isDark = theme === "dark";
  switch (difficulty) {
    case "easy":
      return isDark
        ? "bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 border-emerald-700"
        : "bg-green-100 text-green-800 hover:bg-green-200";
    case "medium":
      return isDark
        ? "bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 border-amber-700"
        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "hard":
      return isDark
        ? "bg-red-900/30 text-red-300 hover:bg-red-900/50 border-red-700"
        : "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return isDark
        ? "bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 border-gray-600"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
