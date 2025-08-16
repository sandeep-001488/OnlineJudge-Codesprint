"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import LoginRequired from "@/components/FeedbackPageComponents/LoginRequired";
import PageHeader from "@/components/FeedbackPageComponents/PageHeader";
import StatusMessage from "@/components/FeedbackPageComponents/StatusMessage";
import FeedbackForm from "@/components/FeedbackPageComponents/FeedbackForm";
import SuggestionForm from "@/components/FeedbackPageComponents/SuggestionForm";
import InfoSection from "@/components/FeedbackPageComponents/InfoSection";
import TabNavigation from "@/components/FeedbackPageComponents/TabNavigation";

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

  if (!user) {
    return <LoginRequired />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <PageHeader />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <StatusMessage success={success} error={error} />

        <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-800/30 overflow-hidden">
          {activeTab === "feedback" ? (
            <FeedbackForm
              user={user}
              feedbackForm={feedbackForm}
              setFeedbackForm={setFeedbackForm}
              onSubmit={handleFeedbackSubmit}
              loading={loading}
            />
          ) : (
            <SuggestionForm
              user={user}
              suggestionForm={suggestionForm}
              setSuggestionForm={setSuggestionForm}
              onSubmit={handleSuggestionSubmit}
              loading={loading}
            />
          )}
        </div>

        <InfoSection activeTab={activeTab} />
      </div>
    </div>
  );
};

export default FeedbackPage;