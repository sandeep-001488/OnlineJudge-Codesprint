import React from "react";
import { Lightbulb, MessageSquare } from "lucide-react";
import UserCard from "./UserCard";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

const SuggestionForm = ({
  user,
  suggestionForm,
  setSuggestionForm,
  onSubmit,
  loading,
}) => {
  const handleInputChange = (field) => (e) => {
    setSuggestionForm({
      ...suggestionForm,
      [field]: e.target.value,
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
          <Lightbulb className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-gray-100">
            Share Your Suggestion
          </h2>
          <p className="text-gray-300 dark:text-gray-400">
            Help us make CodeSprint even better!
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <UserCard user={user} gradientFrom="green-500" gradientTo="blue-500" />

        <FormInput
          label="Your Suggestion"
          icon={MessageSquare}
          type="textarea"
          value={suggestionForm.message}
          onChange={handleInputChange("message")}
          placeholder="What feature would you like to see? How can we improve CodeSprint?"
          rows={6}
          required
          maxLength={1000}
        />

        <SubmitButton
          loading={loading}
          text="Submit Suggestion"
          gradientFrom="green-600"
          gradientTo="blue-600"
          hoverFrom="green-700"
          hoverTo="blue-700"
        />
      </form>
    </div>
  );
};

export default SuggestionForm;
