"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Code,
  Clock,
  User,
  Mail,
  Crown,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ;

export default function UserDashboard({ params }) {
  const router = useRouter();
  const { user: currentUser, isLoggedIn, token } = useAuthStore();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const resolvedParams = use(params);

  useEffect(() => {
    if (currentUser && currentUser.username === resolvedParams?.username) {
      setIsOwnProfile(true);
    }

    fetchUserData();
  }, [resolvedParams?.username, currentUser]);

  const fetchUserData = async () => {
    if (!resolvedParams?.username) {
      setError("Username not provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileResponse = await fetch(
        `${API_BASE_URL}dashboard/profile/${resolvedParams.username}`,
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
        `${API_BASE_URL}dashboard/stats/${resolvedParams.username}`,
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

  const getLastActiveText = (lastActive) => {
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

  const getCompletionPercentage = () => {
    if (!stats || stats.totalProblems === 0) return 0;
    return Math.round((stats.problemsSolved / stats.totalProblems) * 100);
  };

  const formatSubmissionTime = (createdAt) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error === "User not found" ? "User Not Found" : "Error"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error === "User not found"
                ? "The user you're looking for doesn't exist."
                : "Failed to load user data. Please try again."}
            </p>
            <div className="space-x-2">
              <Button onClick={() => router.push("/")}>Go Home</Button>
              {error !== "User not found" && (
                <Button variant="outline" onClick={fetchUserData}>
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                {stats?.rank <= 10 && (
                  <Crown className="h-8 w-8 text-yellow-300" />
                )}
              </div>
              {isOwnProfile && user.email && (
                <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-blue-100">{user.email}</span>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-blue-100">
                  {getLastActiveText(stats?.lastActive)}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>Rank #{stats?.rank || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Problems Solved
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.problemsSolved || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  of {stats?.totalProblems || 0} ({getCompletionPercentage()}%)
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Global Rank
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  #{stats?.rank || "N/A"}
                </p>
                {stats?.rank && stats?.totalProblems && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    Top {Math.round((stats.rank / 10000) * 100)}%
                  </p>
                )}
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.streak || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  days active
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Active
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {getLastActiveText(stats?.lastActive)}
                </p>
                {stats?.lastActive && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(stats.lastActive).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-600" />
              <span>Strong Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.tags && user.tags.length > 0 ? (
                user.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No solved problems yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Recent Submissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.recentSubmissions && user.recentSubmissions.length > 0 ? (
                user.recentSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {submission.problemId?.title || "Unknown Problem"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatSubmissionTime(submission.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        submission.status === "Accepted"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        submission.status === "Accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent submissions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Solving Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Progress chart will be implemented with real data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
