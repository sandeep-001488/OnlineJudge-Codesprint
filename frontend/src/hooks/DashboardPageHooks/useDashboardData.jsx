import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useDashboardData = (username) => {
  const { user: currentUser, token } = useAuthStore();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const calculateStreak = (recentSubmissions) => {
    if (!recentSubmissions || recentSubmissions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    const submissionDates = new Set();

    recentSubmissions.forEach((submission) => {
      const submissionDate = new Date(submission.createdAt);
      submissionDate.setHours(0, 0, 0, 0);
      submissionDates.add(submissionDate.getTime());
    });

    const sortedDates = Array.from(submissionDates).sort((a, b) => b - a);

    let currentDate = today.getTime();
    for (const submissionTime of sortedDates) {
      if (submissionTime === currentDate) {
        streak++;
        currentDate -= 24 * 60 * 60 * 1000;
      } else if (submissionTime === currentDate + 24 * 60 * 60 * 1000) {
        if (streak === 0) {
          streak++;
          currentDate = submissionTime - 24 * 60 * 60 * 1000;
        }
      } else {
        break;
      }
    }

    return streak;
  };

  const fetchUserData = async () => {
    if (!username) {
      setError("Username not provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileResponse = await fetch(
        `${API_BASE_URL}dashboard/profile/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!profileResponse.ok) {
        if (profileResponse.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();

      const statsResponse = await fetch(
        `${API_BASE_URL}dashboard/stats/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch user stats");
      }

      const statsData = await statsResponse.json();

      setUser({
        ...profileData.user,
        recentSubmissions: statsData.stats.recentSubmissions,
        tags: statsData.stats.strongTopics,
      });

      setStats({
        problemsSolved: statsData.stats.problemsSolved,
        totalProblems: statsData.stats.totalProblems,
        rank: statsData.stats.rank,
        lastActive: new Date(
          statsData.stats.lastActive || profileData.user.createdAt
        ),
        streak: calculateStreak(statsData.stats.recentSubmissions),
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.username === username) {
      setIsOwnProfile(true);
    }
    fetchUserData();
  }, [username, currentUser]);

  return {
    user,
    stats,
    loading,
    error,
    isOwnProfile,
    refetch: fetchUserData,
  };
};
