import React from "react";
import { Target, Trophy, Award, Clock, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

const StatsGrid = ({ stats, getCompletionPercentage, getLastActiveText }) => {
  const getRankPercentage = () => {
    if (!stats?.rank || !stats?.totalProblems) return null;
    return `Top ${Math.round((stats.rank / 10000) * 100)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Target}
        title="Problems Solved"
        mainValue={stats?.problemsSolved || 0}
        subValue={`of ${
          stats?.totalProblems || 0
        } (${getCompletionPercentage()}%)`}
        color="text-blue-600"
      />

      <StatCard
        icon={Trophy}
        title="Global Rank"
        mainValue={`#${stats?.rank || "N/A"}`}
        accentText={
          getRankPercentage() && (
            <>
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {getRankPercentage()}
            </>
          )
        }
        color="text-yellow-600"
      />

      <StatCard
        icon={Award}
        title="Current Streak"
        mainValue={stats?.streak || 0}
        subValue="days active"
        color="text-purple-600"
      />

      <StatCard
        icon={Clock}
        title="Last Active"
        mainValue={getLastActiveText(stats?.lastActive)}
        subValue={
          stats?.lastActive && new Date(stats.lastActive).toLocaleDateString()
        }
        color="text-green-600"
      />
    </div>
  );
};

export default StatsGrid;
