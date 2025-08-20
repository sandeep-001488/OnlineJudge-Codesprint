import { useState } from "react";
import { BadgePlus, Play, ArrowRight, Award, TrendingUp } from "lucide-react";

export default function HeroSection({ isAdmin, homeStats, router }) {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="relative z-10 px-6 pt-20 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-white dark:text-gray-100 mb-6 leading-tight">
              Dry Run{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                To.
              </span>
              <br />
              Code...
            </h1>
            <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
              Perfect your logic, crush the testcases, hit submit. Experience
              the complete competitive programming workflow designed for
              champions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isAdmin && (
                <button
                  onClick={() => router.push("/admin/problems/create")}
                  className="group bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-2xl"
                >
                  <BadgePlus className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Create Problem</span>
                </button>
              )}

              <button
                onClick={() =>
                  router.push(isAdmin ? "/admin/problems" : "/problems")
                }
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="group bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 
   text-white dark:text-gray-100 px-8 py-4 rounded-full text-lg font-semibold 
   hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 
   flex items-center justify-center space-x-2 hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                {!hovered && (
                  <Play className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
                <span className="transition-all duration-300">
                  {hovered ? "Good Luck 🚀" : "Start Coding"}
                </span>
                {!hovered && (
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white dark:text-gray-100 mb-1">
                  {homeStats?.totalUsers
                    ? homeStats.totalUsers > 1000
                      ? `${(homeStats.totalUsers / 1000).toFixed(1)}K+`
                      : `${homeStats.totalUsers}+`
                    : "100"}
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Active Coders
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white dark:text-gray-100 mb-1">
                  {homeStats?.totalProblemsWithAcceptedSubmissions
                    ? homeStats.totalProblemsWithAcceptedSubmissions > 1000
                      ? `${(
                          homeStats.totalProblemsWithAcceptedSubmissions / 1000
                        ).toFixed(1)}K+`
                      : `${homeStats.totalProblemsWithAcceptedSubmissions}+`
                    : "500+"}
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Problems Solved
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-900/50 dark:bg-gray-950/70 backdrop-blur-xl border border-white/10 dark:border-gray-800/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 dark:text-gray-500 text-sm ml-4">
                  solve.cpp
                </span>
              </div>

              <div className="font-mono text-sm space-y-2">
                <div className="text-purple-400">#include &lt;iostream&gt;</div>
                <div className="text-blue-400">using namespace std;</div>
                <div className="text-green-400">// Your solution here...</div>
                <div className="text-yellow-400">int main() &#123;</div>
                <div className="text-gray-300 dark:text-gray-400 ml-4">
                  vector&lt;int&gt; nums = &#123;2, 7, 11, 15&#125;;
                </div>
                <div className="text-gray-300 dark:text-gray-400 ml-4">
                  int target = 9;
                </div>
                <div className="text-pink-400 ml-4 animate-pulse">
                  // ✨ AI suggests: Two Sum approach
                </div>
                <div className="text-yellow-400">&#125;</div>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">
                    Tests Passing: 8/8
                  </span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Runtime: 4ms (95.3% faster)
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg animate-bounce">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full shadow-lg animate-pulse">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
