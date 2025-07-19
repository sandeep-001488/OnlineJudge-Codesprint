import React from 'react'
import { Code } from 'lucide-react';

const Footer = () => {
  return (
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
  );
}

export default Footer