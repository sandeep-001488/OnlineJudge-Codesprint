export default function StatsSection({ homeStats }) {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Join the Revolution
              </h2>
              <p className="text-xl text-blue-100">
                Numbers that speak for themselves
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  {homeStats?.totalUsers
                    ? homeStats.totalUsers > 1000
                      ? `${(homeStats.totalUsers / 1000).toFixed(1)}K+`
                      : `${homeStats.totalUsers}+`
                    : "100"}
                </div>
                <div className="text-blue-100">Active Users</div>
                <div className="w-full bg-blue-400/20 rounded-full h-2 mt-2">
                  <div className="bg-blue-300 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>

              <div className="group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  {homeStats?.totalProblemsWithAcceptedSubmissions
                    ? homeStats.totalProblemsWithAcceptedSubmissions > 1000
                      ? `${(
                          homeStats.totalProblemsWithAcceptedSubmissions / 1000
                        ).toFixed(1)}K+`
                      : `${homeStats.totalProblemsWithAcceptedSubmissions}+`
                    : "500"}
                </div>
                <div className="text-blue-100">Problems Solved</div>
                <div className="w-full bg-purple-400/20 rounded-full h-2 mt-2">
                  <div className="bg-purple-300 h-2 rounded-full w-4/5 animate-pulse"></div>
                </div>
              </div>

              <div className="group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  4
                </div>
                <div className="text-blue-100">Languages Supported</div>
                <div className="w-full bg-pink-400/20 rounded-full h-2 mt-2">
                  <div className="bg-pink-300 h-2 rounded-full w-2/3 animate-pulse"></div>
                </div>
              </div>

              <div className="group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  0
                </div>
                <div className="text-blue-100">Contests Held</div>
                <div className="w-full bg-green-400/20 rounded-full h-2 mt-2">
                  <div className="bg-green-300 h-2 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
