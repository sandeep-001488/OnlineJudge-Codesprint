// src/app/page.js
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code,
  Trophy,
  Users,
  BookOpen,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Competitive
              </span>{" "}
              Programming
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Solve challenging problems, compete with developers worldwide, and
              enhance your coding skills with our comprehensive online judge
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Coding
                </Button>
              </Link>
              <Link href="/problems">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg"
                >
                  Browse Problems
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CodeJudge?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to excel in competitive programming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/70 backdrop-blur-lg dark:bg-gray-800/70 border-0 shadow-xl">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">
                  1000+ Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Extensive collection of problems from beginner to advanced
                  levels, covering all major algorithms and data structures.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-lg dark:bg-gray-800/70 border-0 shadow-xl">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">
                  Live Contests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Participate in weekly contests, compete with programmers
                  globally, and climb the leaderboard.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-lg dark:bg-gray-800/70 border-0 shadow-xl">
              <CardHeader>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">
                  Instant Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Get immediate results with detailed feedback on your
                  submissions, helping you learn and improve faster.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Problems Solved</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Contests Held</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Problems Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Problems
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Start with these community favorites
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Two Sum",
                difficulty: "Easy",
                solved: "25.2K",
                rating: 4.5,
              },
              {
                title: "Binary Tree Traversal",
                difficulty: "Medium",
                solved: "18.7K",
                rating: 4.3,
              },
              {
                title: "Dynamic Programming",
                difficulty: "Hard",
                solved: "12.1K",
                rating: 4.7,
              },
              {
                title: "Graph Algorithms",
                difficulty: "Medium",
                solved: "15.8K",
                rating: 4.4,
              },
              {
                title: "String Matching",
                difficulty: "Easy",
                solved: "22.3K",
                rating: 4.2,
              },
              {
                title: "Sorting Algorithms",
                difficulty: "Medium",
                solved: "19.5K",
                rating: 4.6,
              },
            ].map((problem, index) => (
              <Card
                key={index}
                className="bg-white/70 backdrop-blur-lg dark:bg-gray-800/70 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {problem.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{problem.solved} solved</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{problem.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers who are already improving their skills
            with CodeJudge
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeJudge
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              © 2025 CodeJudge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      {/* </div> */}
    </>
  );
}
