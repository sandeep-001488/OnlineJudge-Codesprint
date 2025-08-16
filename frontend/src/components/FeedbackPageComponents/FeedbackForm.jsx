import React from "react";
import { Heart, Briefcase, Building, MessageSquare } from "lucide-react";
import UserCard from "./UserCard";
import FormInput from "./FormInput";
import StarRating from "./StarRating";
import SubmitButton from "./SubmitButton";

const FeedbackForm = ({
  user,
  feedbackForm,
  setFeedbackForm,
  onSubmit,
  loading,
}) => {
  const handleInputChange = (field) => (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [field]: e.target.value,
    });
  };

  const handleRatingChange = (rating) => {
    setFeedbackForm({ ...feedbackForm, rating });
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-gray-100">
            Share Your Feedback
          </h2>
          <p className="text-gray-300 dark:text-gray-400">
            Your feedback might be featured on our home page!
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <UserCard user={user} />

        <div className="grid md:grid-cols-2 gap-6">
          <FormInput
            label="Your Role"
            icon={Briefcase}
            value={feedbackForm.role}
            onChange={handleInputChange("role")}
            placeholder="e.g., Software Engineer, Student, Tech Lead"
            required
            maxLength={100}
          />

          <FormInput
            label="College/University"
            icon={Building}
            value={feedbackForm.university}
            onChange={handleInputChange("university")}
            placeholder="e.g., IIIT Ranchi, IIT Delhi"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-3">
            Rate Your Experience
          </label>
          <div className="flex items-center space-x-4">
            <StarRating
              rating={feedbackForm.rating}
              interactive={true}
              onRatingChange={handleRatingChange}
            />
            <span className="text-gray-300 dark:text-gray-400">
              ({feedbackForm.rating} star
              {feedbackForm.rating !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        <FormInput
          label="Your Feedback"
          icon={MessageSquare}
          type="textarea"
          value={feedbackForm.content}
          onChange={handleInputChange("content")}
          placeholder="Share your experience with CodeSprint... (max 100 words)"
          rows={4}
          required
          maxLength={600}
        />

        <SubmitButton loading={loading} text="Submit Feedback" />
      </form>
    </div>
  );
};

export default FeedbackForm;
