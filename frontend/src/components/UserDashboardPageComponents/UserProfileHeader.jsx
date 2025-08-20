import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Crown, Activity, Trophy, Calendar } from "lucide-react";
import EditableUsername from "./EditableUsername";
import { useAuthStore } from "@/store/authStore";

const UserProfileHeader = ({
  user,
  stats,
  isOwnProfile,
  getLastActiveText,
}) => {
  const { user: loggedInUser } = useAuthStore();

  const profilePicture = loggedInUser?.picture || user?.picture;

  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <EditableUsername
                username={user?.username || "User"}
                isOwnProfile={isOwnProfile}
              />
              {stats?.rank <= 10 && (
                <Crown className="h-8 w-8 text-yellow-300" />
              )}
            </div>
            {isOwnProfile && user?.email && (
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
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileHeader;
