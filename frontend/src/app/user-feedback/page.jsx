"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Star,
  Send,
  Building,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Heart,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const FeedbackPage = () => {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState("feedback");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [feedbackForm, setFeedbackForm] = useState({
    role: "",
    university: "",
    content: "",
    rating: 5,
  });

  const [suggestionForm, setSuggestionForm] = useState({
    message: "",
  });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to submit feedback");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}feedback/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(feedbackForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Thank you for your feedback! It will be reviewed and may appear on our home page."
        );
        setFeedbackForm({
          role: "",
          university: "",
          content: "",
          rating: 5,
        });
      } else {
        setError(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to submit suggestion");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}feedback/suggestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(suggestionForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Thank you for your suggestion! Our team will review it carefully."
        );
        setSuggestionForm({ message: "" });
      } else {
        setError(data.message || "Failed to submit suggestion");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
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
            onClick={
              interactive
                ? () => setFeedbackForm({ ...feedbackForm, rating: star })
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-800/30 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-4">
            Login Required
          </h2>
          <p className="text-gray-300 dark:text-gray-400 mb-6">
            Please login to share your feedback or suggestions with us.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-4">
            Share Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
            Help us improve CodeSprint by sharing your feedback or suggesting
            new features
          </p>
        </div>

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

        {(success || error) && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              success
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-red-500/20 border border-red-500/30 text-red-400"
            }`}
          >
            {success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{success || error}</span>
          </div>
        )}

        <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-800/30 overflow-hidden">
          {activeTab === "feedback" ? (
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

              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="bg-white/5 dark:bg-gray-800/20 rounded-lg p-4 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
                      <Briefcase className="h-4 w-4 inline mr-2" />
                      Your Role
                    </label>
                    <input
                      type="text"
                      value={feedbackForm.role}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          role: e.target.value,
                        })
                      }
                      placeholder="e.g., Software Engineer, Student, Tech Lead"
                      className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
                      <Building className="h-4 w-4 inline mr-2" />
                      College/University
                    </label>
                    <input
                      type="text"
                      value={feedbackForm.university}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          university: e.target.value,
                        })
                      }
                      placeholder="e.g., IIIT Ranchi, IIT Delhi"
                      className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-3">
                    Rate Your Experience
                  </label>
                  <div className="flex items-center space-x-4">
                    {renderStars(feedbackForm.rating, true)}
                    <span className="text-gray-300 dark:text-gray-400">
                      ({feedbackForm.rating} star
                      {feedbackForm.rating !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackForm.content}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        content: e.target.value,
                      })
                    }
                    placeholder="Share your experience with CodeSprint... (max 100 words)"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                    maxLength={600}
                  />
                  <div className="text-right text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {feedbackForm.content.length}/600 characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-semibold transition-all hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
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

              <form onSubmit={handleSuggestionSubmit} className="space-y-6">
                <div className="bg-white/5 dark:bg-gray-800/20 rounded-lg p-4 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Your Suggestion
                  </label>
                  <textarea
                    value={suggestionForm.message}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="What feature would you like to see? How can we improve CodeSprint?"
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {suggestionForm.message.length}/1000 characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-semibold transition-all hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Suggestion</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white/5 dark:bg-gray-900/20 backdrop-blur-xl rounded-lg p-6 border border-white/10 dark:border-gray-800/20">
            <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-2">
              {activeTab === "feedback"
                ? "About Feedback"
                : "About Suggestions"}
            </h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm">
              {activeTab === "feedback"
                ? "Your feedback helps us understand what's working well and may be featured on our homepage to inspire other developers."
                : "Your suggestions drive our roadmap. We carefully review every suggestion and prioritize the most impactful improvements."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
