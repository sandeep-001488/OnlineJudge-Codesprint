import { Code2 } from "lucide-react";

export default function Footer() {
  return (
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
              Empowering developers worldwide to master competitive programming
              and achieve their coding dreams.
            </p>
          </div>
          <div>
            <h3 className="text-white dark:text-gray-100 font-semibold mb-4">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/problems"
                  className="text-white font-semibold dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
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
                  className="text-white font-semibold dark:text-gray-500   dark:hover:text-gray-100 transition-colors"
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
  );
}
