import React from "react";
import { Send } from "lucide-react";

const SubmitButton = ({
  loading,
  text,
  gradientFrom = "blue-600",
  gradientTo = "purple-600",
  hoverFrom = "blue-700",
  hoverTo = "purple-700",
}) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo} hover:from-${hoverFrom} hover:to-${hoverTo} disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-semibold transition-all hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <>
          <Send className="h-5 w-5" />
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default SubmitButton;
