import Feedback from "../models/feedback.model.js";
import Submission from "../models/submission.model.js";
import Suggestion from "../models/suggestion.model.js";
import User from "../models/user.model.js";
import Problem from "../models/problem.model.js";

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export async function createFeedbackService(userId, feedbackData) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const feedback = new Feedback({
    ...feedbackData,
    userId,
    name: user.username || feedbackData.name,
    avatar: (user.username || feedbackData.name).charAt(0).toUpperCase(),
  });

  await feedback.save();
  return feedback.populate("userId", "name email");
}

export async function getRecentFeedbacksService(limit = 6) {
  const feedbacks = await Feedback.find({ isVisible: true })
    .populate("userId", "username firstName lastName")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return feedbacks.map((feedback) => ({
    name: feedback.name,
    role: feedback.role,
    university: feedback.university,
    content: feedback.content,
    rating: feedback.rating,
    avatar: feedback.avatar,
    createdAt: feedback.createdAt,
  }));
}

export async function getAllFeedbacksService(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const feedbacks = await Feedback.find({ isVisible: true })
    .populate("userId", "username firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Feedback.countDocuments({ isVisible: true });

  return {
    feedbacks,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
}

export async function createSuggestionService(userId, suggestionData) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const suggestion = new Suggestion({
    ...suggestionData,
    userId,
    name: user.username || suggestionData.name,
  });

  await suggestion.save();
  return suggestion.populate("userId", "name email");
}

export async function getHomePageStatsService() {
  const [
    totalUsers,
    totalProblemsWithAcceptedSubmissions,
    latestSolver,
    latestUser,
    latestFeedback,
    topRankedUser,
    recentProblems,
  ] = await Promise.all([
    User.countDocuments({}),
    Submission.aggregate([
      { $match: { status: "Accepted" } },
      { $group: { _id: "$problemId" } },
      { $count: "total" },
    ]),
    Submission.findOne({ status: "Accepted" })
      .populate("userId", "username firstName lastName")
      .populate("problemId", "title")
      .sort({ createdAt: -1 }),
    User.findOne({}).sort({ createdAt: -1 }),
    Feedback.findOne({ isVisible: true })
      .populate("userId", "username firstName lastName")
      .sort({ createdAt: -1 }),
    Submission.aggregate([
      { $match: { status: "Accepted" } },
      { $group: { _id: "$userId", solvedCount: { $addToSet: "$problemId" } } },
      { $addFields: { totalSolved: { $size: "$solvedCount" } } },
      { $sort: { totalSolved: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
    ]),
    Problem.find({})
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  const problemsWithStats = await Promise.all(
    recentProblems.map(async (problem) => {
      const uniqueSolvers = await Submission.aggregate([
        { $match: { problemId: problem._id, status: "Accepted" } },
        { $group: { _id: "$userId" } },
        { $count: "total" },
      ]);
      const solverCount = uniqueSolvers[0]?.total || 0;
      const tags = problem.tags.slice(0, 2);

      return {
        id: problem._id,
        title: problem.title,
        difficulty:
          problem.difficulty.charAt(0).toUpperCase() +
          problem.difficulty.slice(1),
        solved:
          solverCount > 1000
            ? `${(solverCount / 1000).toFixed(1)}K`
            : solverCount.toString(),
        tags: tags.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)),
        trending: Math.random() > 0.5,
        rating: 4.5,
      };
    })
  );

  return {
    totalUsers: totalUsers || 0,
    totalProblemsWithAcceptedSubmissions:
      totalProblemsWithAcceptedSubmissions[0]?.total || 0,
    latestActivity: {
      solver: latestSolver
        ? {
            name:
              latestSolver.userId?.username ||
              latestSolver.userId?.firstName ||
              "Anonymous",
            problemTitle: latestSolver.problemId?.title || "Unknown Problem",
            time: getTimeAgo(latestSolver.createdAt),
          }
        : null,
      newUser: latestUser
        ? {
            name: latestUser.username || latestUser.firstName || "Anonymous",
            time: getTimeAgo(latestUser.createdAt),
          }
        : null,
      feedback: latestFeedback
        ? {
            name:
              latestFeedback.name ||
              latestFeedback.userId?.username ||
              latestFeedback.userId?.firstName ||
              "Anonymous",
            time: getTimeAgo(latestFeedback.createdAt),
          }
        : null,
      topRanked: topRankedUser[0]
        ? {
            name:
              topRankedUser[0].userDetails.username ||
              topRankedUser[0].userDetails.firstName ||
              "Anonymous",
            solvedCount: topRankedUser[0].totalSolved,
          }
        : null,
    },
    recentProblems: problemsWithStats,
  };
}
