"use client";
import { useState, useEffect } from "react";
import {
  Star,
  ArrowRight,
  BadgePlus,
  Code2,
  Users,
  ChevronLeft,
  ChevronRight,
  Quote,
  Play,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

import {
  dummyPopularProblems,
  dummyTestimonials,
  features,
} from "@/data/HomeData";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [homeStats, setHomeStats] = useState(null);
  const [testimonials, setTestimonials] = useState(dummyTestimonials);
  const [popularProblems, setPopularProblems] = useState(dummyPopularProblems);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (
      user?.role?.includes("admin") ||
      user?.role?.includes("problemSetter")
    ) {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const statsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}feedback/home-stats`
        );
        const statsData = await statsResponse.json();

        const feedbackResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}feedback/feedbacks/recent`
        );
        const feedbackData = await feedbackResponse.json();

        if (statsData.success) {
          setHomeStats(statsData.data);

          if (
            statsData.data.recentProblems &&
            statsData.data.recentProblems.length > 0
          ) {
            setPopularProblems(statsData.data.recentProblems);
          }
        }

        if (feedbackData.success) {
          if (feedbackData.data && feedbackData.data.length > 0) {
            setTestimonials(feedbackData.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 30,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  const slugify = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleProblemClick = (problemTitle, problemId) => {
    const slug = slugify(problemTitle);
    router.push(`/problems/${slug}-${problemId}`);
  };
  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-500 dark:to-purple-500 opacity-30 animate-pulse"
            style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              left: `${el.x}%`,
              top: `${el.y}%`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${el.duration}s`,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl lg:text-7xl font-bold text-white dark:text-gray-100 mb-6 leading-tight">
                Code.{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Compete.
                </span>
                <br />
                Conquer.
              </h1>

              <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                Step into the future of competitive programming. Master
                algorithms, compete globally, and unlock your coding potential
                with our revolutionary platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {isAdmin && (
                  <button className="group bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-2xl">
                    <BadgePlus className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                    <span>Create Problem</span>
                  </button>
                )}

                <button
                  onClick={() => router.push("/problems")}
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
                      : "50K+"}
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
                            homeStats.totalProblemsWithAcceptedSubmissions /
                            1000
                          ).toFixed(1)}K+`
                        : `${homeStats.totalProblemsWithAcceptedSubmissions}+`
                      : "1M+"}
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
                  <div className="text-purple-400">
                    #include &lt;iostream&gt;
                  </div>
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

      {/* Features Section - Keep as is */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
              Why Developers Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeSprint
              </span>
            </h2>
            <p className="text-xl text-gray-400 dark:text-gray-500">
              Next-generation features that set us apart
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer group ${
                  activeFeature === index
                    ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-500/50 dark:border-blue-400/30 scale-105"
                    : "bg-white/5 dark:bg-gray-800/20 border-white/10 dark:border-gray-800/30 hover:bg-white/10 dark:hover:bg-gray-800/30"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300 ${
                    activeFeature === index
                      ? `bg-gradient-to-r ${feature.color} text-white scale-110`
                      : "bg-white/10 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 group-hover:bg-white/20 dark:group-hover:bg-gray-800/50"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Updated with real data */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-400 dark:text-gray-500">
              Real success stories from our community
            </p>
          </div>

          <div className="relative">
            <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-800/30">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() =>
                    setCurrentTestimonial(
                      (prev) =>
                        (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="p-3 rounded-full bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-white dark:text-gray-100" />
                </button>

                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        currentTestimonial === index
                          ? "bg-blue-500"
                          : "bg-white/30 dark:bg-gray-600/50"
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentTestimonial(
                      (prev) => (prev + 1) % testimonials.length
                    )
                  }
                  className="p-3 rounded-full bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-white dark:text-gray-100" />
                </button>
              </div>

              <div className="text-center">
                <Quote className="h-12 w-12 text-blue-400 mx-auto mb-6" />
                <p className="text-2xl text-white dark:text-gray-100 font-medium mb-8 leading-relaxed max-w-4xl mx-auto">
                  "{testimonials[currentTestimonial]?.content}"
                </p>

                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentTestimonial]?.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-semibold text-white dark:text-gray-100">
                      {testimonials[currentTestimonial]?.name}
                    </div>
                    <div className="text-blue-400">
                      {testimonials[currentTestimonial]?.role}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      {testimonials[currentTestimonial]?.university}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-1 mt-4">
                  {Array.from({
                    length: testimonials[currentTestimonial]?.rating || 5,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                className="group bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-800/30 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-gray-900/50 hover:scale-105 transition-all duration-300  relative overflow-hidden"
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
                        <span className="text-yellow-400">
                          {problem.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 dark:border-gray-800/30 pt-4 mt-4 ">
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
                    {homeStats?.latestActivity?.solver?.problemTitle ||
                      "Two Sum"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-green-400 bg-green-500/20 rounded-full px-3 py-1 inline-block">
                {homeStats?.latestActivity?.solver?.time || "Just now"}
              </div>
            </div>

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
                    CodeSprint Community
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
                      : "50K+"}
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
                            homeStats.totalProblemsWithAcceptedSubmissions /
                            1000
                          ).toFixed(1)}K+`
                        : `${homeStats.totalProblemsWithAcceptedSubmissions}+`
                      : "1M+"}
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


      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/50 dark:bg-gray-950/70 backdrop-blur-xl border-t border-white/10 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white dark:text-gray-100">
                  CodeSprint
                </span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
                Empowering developers worldwide to master competitive
                programming and achieve their coding dreams.
              </p>
            </div>

            <div>
              <h3 className="text-white dark:text-gray-100 font-semibold mb-4">
                Platform
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Problems
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Contests
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white dark:text-gray-100 font-semibold mb-4">
                Community
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Discussion Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Discord Server
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white dark:text-gray-100 font-semibold mb-4">
                Support
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    API Docs
                  </a>
                </li>
                <li>
                  <a
                    href="/user-feedback"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 dark:border-gray-800/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-400 dark:text-gray-500">
              © 2025 CodeSprint. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
