import User from "../models/user.model.js";
import Submission from "../models/submission.model.js";
import Problem from "../models/problem.model.js";

export async function getUserProfile(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "-password -resetPasswordCode -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId === user._id.toString()) {
          await User.findByIdAndUpdate(user._id, { lastActive: new Date() });
        }
      } catch (error) {}
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserStats(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const solvedProblems = await Submission.distinct("problemId", {
      userId: user._id,
      status: "Accepted",
    });

    const totalProblems = await Problem.countDocuments();

    const userRankingData = await User.aggregate([
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "userId",
          as: "submissions",
        },
      },
      {
        $addFields: {
          solvedProblems: {
            $setUnion: {
              $map: {
                input: {
                  $filter: {
                    input: "$submissions",
                    cond: { $eq: ["$$this.status", "Accepted"] },
                  },
                },
                as: "submission",
                in: "$$submission.problemId",
              },
            },
          },
          latestAcceptedSubmission: {
            $max: {
              $map: {
                input: {
                  $filter: {
                    input: "$submissions",
                    cond: { $eq: ["$$this.status", "Accepted"] },
                  },
                },
                as: "submission",
                in: "$$submission.createdAt",
              },
            },
          },
        },
      },
      {
        $addFields: {
          solvedCount: { $size: "$solvedProblems" },
        },
      },
      {
        $sort: {
          solvedCount: -1,
          latestAcceptedSubmission: -1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: null,
          users: { $push: "$$ROOT" },
        },
      },
      {
        $unwind: {
          path: "$users",
          includeArrayIndex: "rank",
        },
      },
      {
        $match: {
          "users._id": user._id,
        },
      },
      {
        $project: {
          rank: { $add: ["$rank", 1] },
          solvedCount: "$users.solvedCount",
        },
      },
    ]);

    const rank = userRankingData.length > 0 ? userRankingData[0].rank : 1;

    const recentSubmissions = await Submission.find({ userId: user._id })
      .populate("problemId", "title difficulty")
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const solvedProblemDetails = await Problem.find({
      _id: { $in: solvedProblems },
    }).select("tags difficulty");

    const tagFrequency = {};
    const difficultyWeights = { Easy: 1, Medium: 2, Hard: 3 };

    solvedProblemDetails.forEach((problem) => {
      const weight = difficultyWeights[problem.difficulty] || 1;
      problem.tags?.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + weight;
      });
    });

    const strongTopics = Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag]) => tag);

    const totalSubmissions = await Submission.countDocuments({
      userId: user._id,
    });
    const acceptedSubmissions = await Submission.countDocuments({
      userId: user._id,
      status: "Accepted",
    });
    const acceptanceRate =
      totalSubmissions > 0
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
        : 0;

    const difficultyBreakdown = await Problem.aggregate([
      {
        $match: {
          _id: { $in: solvedProblems },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const difficultyStats = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    difficultyBreakdown.forEach((item) => {
      if (item._id && difficultyStats.hasOwnProperty(item._id)) {
        difficultyStats[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        problemsSolved: solvedProblems.length,
        totalProblems,
        rank,
        recentSubmissions: recentSubmissions.map((submission) => ({
          _id: submission._id,
          problem: submission.problemId,
          status: submission.status,
          createdAt: submission.createdAt,
          language: submission.language,
          executionTime: submission.executionTime,
        })),
        strongTopics,
        lastActive: user.lastActive || user.createdAt,
        totalSubmissions,
        acceptanceRate,
        difficultyStats,
        streak: await calculateUserStreak(user._id),
        contestsParticipated: 0,
        badges: [],
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function calculateUserStreak(userId) {
  try {
    const submissions = await Submission.aggregate([
      {
        $match: {
          userId: userId,
          status: "Accepted",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    if (submissions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (const submission of submissions) {
      const submissionDate = new Date(submission._id);
      const diffDays = Math.floor(
        (currentDate - submissionDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays === streak + 1 && streak === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Calculate streak error:", error);
    return 0;
  }
}

export async function getLeaderboard(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "userId",
          as: "submissions",
        },
      },
      {
        $addFields: {
          solvedProblems: {
            $setUnion: {
              $map: {
                input: {
                  $filter: {
                    input: "$submissions",
                    cond: { $eq: ["$$this.status", "Accepted"] },
                  },
                },
                as: "submission",
                in: "$$submission.problemId",
              },
            },
          },
          latestAcceptedSubmission: {
            $max: {
              $map: {
                input: {
                  $filter: {
                    input: "$submissions",
                    cond: { $eq: ["$$this.status", "Accepted"] },
                  },
                },
                as: "submission",
                in: "$$submission.createdAt",
              },
            },
          },
        },
      },
      {
        $addFields: {
          solvedCount: { $size: "$solvedProblems" },
        },
      },
      {
        $sort: {
          solvedCount: -1,
          latestAcceptedSubmission: -1,
          createdAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          username: 1,
          firstName: 1,
          lastName: 1,
          solvedCount: 1,
          lastActive: 1,
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      leaderboard,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasNext: leaderboard.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
