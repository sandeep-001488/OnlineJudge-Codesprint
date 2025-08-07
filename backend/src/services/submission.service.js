import Submission from "../models/submission.model.js";
import Problem from "../models/problem.model.js";

export const createSubmission = async ({
  problemId,
  user,
  code,
  language,
  status,
  time,
  memory,
  output,
}) => {
  const problem = await Problem.findById(problemId);
  if (!problem) throw new Error("Problem not found");

  const userId = user.id;
  const submission = new Submission({
    problemId,
    userId,
    language,
    code,
    status,
    time,
    memory,
    output,
  });

  await submission.save();

  return {
    success: true,
    message: "Submission created successfully",
    submission,
  };
};

export const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id).populate("problemId userId");
  if (!submission) throw new Error("Submission not found");
  return submission;
};

export const getSubmissionsByUser = async (userId) => {
  return await Submission.find({ userId }).sort({ createdAt: -1 });
};

export const getSubmissionsByProblemAndUser = async (userId, problemId) => {
  return await Submission.find({ userId, problemId }).sort({ createdAt: -1 });
};

export const getAllSubmissions = async (filters = {}, skip = 0, limit = 20) => {
  const submissions = await Submission.find(filters)
    .populate("problemId userId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Submission.countDocuments(filters);

  return { submissions, total };
};

export const deleteSubmissionById = async (submissionId) => {
  const submission = await Submission.findByIdAndDelete(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }
  return submission;
};

