import { useState } from "react";
import { Edit3, Check, X, Info } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const EditableUsername = ({ username, isOwnProfile }) => {
  const router = useRouter();
  const { user, updateUsername, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const hasChangedUsername = user?.hasChangedUsername || false;

  const handleEditClick = () => {
    if (hasChangedUsername) {
      return; 
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (newUsername === username || !newUsername.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      const result = await updateUsername(newUsername.trim());
      setIsEditing(false);
      setError("");

      window.location.href = `/dashboard/${result.user.username}`;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update username");
    }
  };

  const handleCancel = () => {
    setNewUsername(username);
    setIsEditing(false);
    setError("");
  };

  if (!isOwnProfile) {
    return <h1 className="text-3xl font-bold">{username}</h1>;
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="text-xl font-semibold bg-white/20 border border-white/30 rounded px-2 py-1 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{username}</h1>

            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onTouchStart={() => setShowTooltip(true)}
              onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
            >
              {hasChangedUsername ? (
                <div className="p-1 cursor-not-allowed opacity-50">
                  <Edit3 className="h-4 w-4 text-gray-300" />
                </div>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="p-1 hover:bg-white/20 rounded opacity-70 hover:opacity-100 transition-all"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              )}

              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg border border-gray-700">
                    <div className="flex items-center space-x-1">
                      <Info className="h-3 w-3" />
                      <span>
                        {hasChangedUsername
                          ? "Username already changed once"
                          : "Username can only be changed once"}
                      </span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {error && isEditing && (
        <div className="absolute top-full mt-2 left-0 z-50">
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg border border-red-400 flex items-center space-x-2">
            <X className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableUsername;
