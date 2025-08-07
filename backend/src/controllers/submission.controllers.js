import {
  createSubmission,
  getSubmissionById,
  getSubmissionsByUser,
  getSubmissionsByProblemAndUser,
  getAllSubmissions,
  deleteSubmissionById,
} from "../services/submission.service.js";

export async function createSubmissionController(req, res) {
  try {
    const submission = await createSubmission({
      problemId: req.body.problemId,
      user: req.user,
      code: req.body.code,
      language: req.body.language,
      status: req.body.status,
      time: req.body.time,
      memory: req.body.memory,
      output: req.body.output,
    });

    res.status(201).json(submission);
  } catch (err) {
    console.error("Create submission error:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getSubmissionByIdController(req, res) {
  try {
    const submission = await getSubmissionById(req.params.id);
    res.status(200).json({
      success: true,
      submission,
    });
  } catch (err) {
    console.error("Get submission by ID error:", err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getUserSubmissionsController(req, res) {
  try {
    const submissions = await getSubmissionsByUser(req.user.id);
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (err) {
    console.error("User submissions error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getSubmissionsByProblemController(req, res) {
  try {
    const { problemId } = req.params;
    const submissions = await getSubmissionsByProblemAndUser(
      req.user.id,
      problemId
    );
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (err) {
    console.error("Problem submissions error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getAllSubmissionsController(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { submissions, total } = await getAllSubmissions({}, skip, limit);

    res.status(200).json({
      success: true,
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get all submissions error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const deleteSubmissionController = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteSubmissionById(id);
    res.status(200).json({
      message: "Submission deleted successfully",
      submission: deleted,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
