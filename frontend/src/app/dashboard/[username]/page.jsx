"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/DashboardPageHooks/useDashboardData";
import LoadingSpinner from "@/components/UserDashboardPageComponents/LoadingSpinner";
import ErrorCard from "@/components/UserDashboardPageComponents/ErrorCard";
import UserProfileHeader from "@/components/UserDashboardPageComponents/UserProfileHeader";
import StatsGrid from "@/components/UserDashboardPageComponents/StatsGrid";
import StrongTopicsCard from "@/components/UserDashboardPageComponents/StrongTopicsCard";
import RecentSubmissionsCard from "@/components/UserDashboardPageComponents/RecentSubmissionsCard";
import ProgressChart from "@/components/UserDashboardPageComponents/ProgressChart";
import {
  formatSubmissionTime,
  getCompletionPercentage,
  getLastActiveText,
} from "@/lib/DashboardHelpers";


export default function UserDashboard({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { user, stats, loading, error, isOwnProfile, refetch } =
    useDashboardData(resolvedParams?.username);

  if (loading) {
    return <LoadingSpinner />;
  }
  

  if (error || !user) {
    return (
      <ErrorCard
        error={error}
        onRetry={refetch}
        onGoHome={() => router.push("/")}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <UserProfileHeader
        user={user}
        stats={stats}
        isOwnProfile={isOwnProfile}
        getLastActiveText={getLastActiveText}
      />

      <StatsGrid
        stats={stats}
        getCompletionPercentage={() => getCompletionPercentage(stats)}
        getLastActiveText={getLastActiveText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StrongTopicsCard tags={user.tags} />
        <RecentSubmissionsCard
          recentSubmissions={user.recentSubmissions}
          formatSubmissionTime={formatSubmissionTime}
        />
      </div>

      <ProgressChart />
    </div>
  );
}
