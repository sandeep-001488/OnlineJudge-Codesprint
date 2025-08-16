import { TrendingUp, Users, Star, Clock, ArrowRight } from "lucide-react";

export default function TrendingProblems({
  popularProblems,
  handleProblemClick,
}) {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
            Trending Problems
          </h2>
          <p className="text-xl text-gray-400 dark:text-gray-500">
            Most loved challenges by our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProblems.slice(0, 6).map((problem, index) => (
            <div
              key={index}
              className="group bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-800/30 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-gray-900/50 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              {problem.trending && (
                <div className="absolute top-20 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Trending</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white dark:text-gray-100 text-lg group-hover:text-blue-400 transition-colors">
                  {problem.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags?.slice(0, 2).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{problem.solved} solved</span>
                  </span>
                  {problem.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400">{problem.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 dark:border-gray-800/30 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <button
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 group cursor-pointer"
                    onClick={() =>
                      handleProblemClick(problem.title, problem.id)
                    }
                  >
                    <Clock className="h-3 w-3" />
                    <span>Solve Now</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
