import {
  createFeedbackService,
  createSuggestionService,
  getAllFeedbacksService,
  getHomePageStatsService,
  getRecentFeedbacksService,
} from "../services/feedback.service.js";

export async function createFeedbackController(req, res) {
  try {
    const feedback = await createFeedbackService(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createSuggestionController(req, res) {
  try {
    const suggestion = await createSuggestionService(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully",
      data: suggestion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getRecentFeedbacksController(req, res) {
  try {
    const feedbacks = await getRecentFeedbacksService(
      parseInt(req.query.limit) || 6
    );
    if (feedbacks.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Recent feedbacks retrieved successfully (dummy data)",
        data: [
          {
            name: "Nithin",
            role: "Software Engineer",
            avatar: "N",
            content: "CodingKaro transformed my problem-solving skills.",
            rating: 5,
            university: "IIIT Ranchi",
          },
          {
            name: "Punya",
            role: "Competitive Programmer",
            avatar: "P",
            content: "The live contests here are incredible!",
            rating: 5,
            university: "IIIT Ranchi",
          },
        ],
        isDummy: true,
      });
    }
    res.status(200).json({
      success: true,
      message: "Recent feedbacks retrieved successfully",
      data: feedbacks,
      isDummy: false,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAllFeedbacksController(req, res) {
  try {
    const result = await getAllFeedbacksService(
      parseInt(req.query.page) || 1,
      parseInt(req.query.limit) || 10
    );
    res.status(200).json({
      success: true,
      message: "Feedbacks retrieved successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getHomePageStatsController(req, res) {
  try {
    const stats = await getHomePageStatsService();
    res.status(200).json({
      success: true,
      message: "Home page statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
