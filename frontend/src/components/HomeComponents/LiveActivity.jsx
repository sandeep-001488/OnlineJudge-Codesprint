export default function LiveActivity({ homeStats, capitalizeFirstLetter }) {
  return (
    <section className="relative z-10 py-20 bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 dark:from-indigo-950/20 dark:to-cyan-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
            Live Activity
          </h2>
          <p className="text-xl text-gray-400 dark:text-gray-500">
            See what's happening right now
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Latest Solver */}
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {homeStats?.latestActivity?.solver?.name
                  ?.charAt(0)
                  .toUpperCase() || "S"}
              </div>
              <div>
                <div className="text-white dark:text-gray-100 font-medium">
                  {capitalizeFirstLetter(
                    homeStats?.latestActivity?.solver?.name
                  ) || "Sandeep"}{" "}
                  solved
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  {homeStats?.latestActivity?.solver?.problemTitle || "Two Sum"}
                </div>
              </div>
            </div>
            <div className="text-xs text-green-400 bg-green-500/20 rounded-full px-3 py-1 inline-block">
              {homeStats?.latestActivity?.solver?.time || "Just now"}
            </div>
          </div>

          {/* New User */}
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {homeStats?.latestActivity?.newUser?.name
                  ?.charAt(0)
                  .toUpperCase() || "A"}
              </div>
              <div>
                <div className="text-white dark:text-gray-100 font-medium">
                  {capitalizeFirstLetter(
                    homeStats?.latestActivity?.newUser?.name || "Ankit"
                  )}{" "}
                  joined
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  CodingKaro Community
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-400 bg-blue-500/20 rounded-full px-3 py-1 inline-block">
              {homeStats?.latestActivity?.newUser?.time || "2 min ago"}
            </div>
          </div>

          {/* Latest Feedback */}
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                {homeStats?.latestActivity?.feedback?.name
                  ?.charAt(0)
                  .toUpperCase() || "A"}
              </div>
              <div>
                <div className="text-white dark:text-gray-100 font-medium">
                  {capitalizeFirstLetter(
                    homeStats?.latestActivity?.feedback?.name || "Akash"
                  )}{" "}
                  gave feedback
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  5 Star Review!
                </div>
              </div>
            </div>
            <div className="text-xs text-yellow-400 bg-yellow-500/20 rounded-full px-3 py-1 inline-block">
              {homeStats?.latestActivity?.feedback?.time || "5 min ago"}
            </div>
          </div>

          {/* Top Ranked User */}
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {homeStats?.latestActivity?.topRanked?.name
                  ?.charAt(0)
                  .toUpperCase() || "N"}
              </div>
              <div>
                <div className="text-white dark:text-gray-100 font-medium">
                  {capitalizeFirstLetter(
                    homeStats?.latestActivity?.topRanked?.name || "Nikhil"
                  )}
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  {homeStats?.latestActivity?.topRanked?.solvedCount || "150"}{" "}
                  problems solved
                </div>
              </div>
            </div>
            <div className="text-xs text-purple-400 bg-purple-500/20 rounded-full px-3 py-1 inline-block">
              Top Rank
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
