import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, interactive = false, onRatingChange }) => {
  const handleStarClick = (star) => {
    if (interactive && onRatingChange) {
      onRatingChange(star);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            star <= rating
              ? "text-yellow-400 fill-current"
              : "text-gray-300 dark:text-gray-600"
          } ${interactive ? "hover:text-yellow-400" : ""}`}
          onClick={() => handleStarClick(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
