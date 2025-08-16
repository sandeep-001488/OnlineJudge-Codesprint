import { Code2, Cpu, Target, Users } from "lucide-react";

export const features = [
  {
    icon: <Code2 className="h-8 w-8" />,
    title: "AI-Powered Hints",
    description:
      "Get contextual hints when you're stuck, powered by advanced AI",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Personalized Learning",
    description:
      "Custom problem recommendations based on your skill level and progress",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborative Solving",
    description: "Team up with other coders to solve complex problems together",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Real-time Execution",
    description:
      "See your code execute in real-time with advanced debugging tools",
    color: "from-orange-500 to-red-500",
  },
];

export const dummyTestimonials = [
  {
    name: "Nithin",
    role: "Software Engineer ",
    avatar: "N",
    content:
      "CodingKaro transformed my problem-solving skills. The instant feedback and diverse problem set helped me crack my dream job interview!",
    rating: 5,
    university: "IIIT Ranchi",
  },
  {
    name: "Punya",
    role: "Competitive Programmer",
    avatar: "P",
    content:
      "The live contests here are incredible! I've improved my world ranking by 500+ positions in just 6 months.",
    rating: 5,
    university: "IIIT Ranchi",
  },
  {
    name: "Aditya Raj",
    role: "SOftware Engineer at UKG",
    avatar: "AR",
    content:
      "As a beginner, the progressive difficulty system and detailed explanations made learning algorithms actually fun!",
    rating: 5,
    university: "IIIT Ranchi",
  },
  {
    name: "Gaurang",
    role: "Tech Lead at IIIT Ranchi",
    avatar: "G",
    content:
      "I use CodingKaro to stay sharp. The platform's quality and community engagement are unmatched.",
    rating: 5,
    university: "IIIT Ranchi",
  },
];

export const dummyPopularProblems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    solved: "25.2K",
    rating: 4.5,
    likes: 1240,
    comments: 89,
    trending: true,
    tags: ["Array", "Hash Table"],
  },
  {
    title: "Binary Tree Traversal",
    difficulty: "Medium",
    solved: "18.7K",
    rating: 4.3,
    likes: 892,
    comments: 134,
    trending: false,
    tags: ["Tree", "DFS"],
  },
  {
    title: "Dynamic Programming Mastery",
    difficulty: "Hard",
    solved: "12.1K",
    rating: 4.7,
    likes: 2156,
    comments: 312,
    trending: true,
    tags: ["DP", "Optimization"],
  },
  {
    title: "Graph Algorithms",
    difficulty: "Medium",
    solved: "15.8K",
    rating: 4.4,
    likes: 743,
    comments: 67,
    trending: false,
    tags: ["Graph", "BFS"],
  },
  {
    title: "String Pattern Matching",
    difficulty: "Easy",
    solved: "22.3K",
    rating: 4.2,
    likes: 534,
    comments: 45,
    trending: true,
    tags: ["String", "Pattern"],
  },
  {
    title: "Advanced Sorting",
    difficulty: "Medium",
    solved: "19.5K",
    rating: 4.6,
    likes: 1089,
    comments: 156,
    trending: false,
    tags: ["Sorting", "Algorithm"],
  },
];
