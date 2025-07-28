import Problem from "../models/problem.model.js";

export async function createProblem(problemData, userId) {
  const newProblem = await Problem.create({
    ...problemData,
    createdBy: userId,
  });

  return newProblem;
}

export async function getAllProblems(filters = {}, skip = 0, limit = 10) {
  try {
    const total = await Problem.countDocuments(filters);

    const problems = await Problem.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "username")  
      .lean();

    return {
      problems,
      total, 
    };
  } catch (error) {
    throw new Error(`Error fetching problems: ${error.message}`);
  }
}


export async function getProblemById(id) {
  return await Problem.findById(id).populate("createdBy", "username email");
}

// Update problem 
export async function updateProblem(problemId, updates, userId) {
  const problem = await Problem.findById(problemId);
  if (!problem) throw new Error("Problem not found");
  if (String(problem.createdBy) !== String(userId)) {
    throw new Error("You are not authorized to update this problem");
  }

  Object.assign(problem, updates);
  await problem.save();
  return problem;
}

// Delete problem
export async function deleteProblem(problemId, userId) {
  const problem = await Problem.findById(problemId);
  if (!problem) throw new Error("Problem not found");
  if (String(problem.createdBy) !== String(userId)) {
    throw new Error("You are not authorized to delete this problem");
  }

  await problem.remove();
  return;
}

export async function searchProblems(filters = {}) {
  try {
    const problems = await Problem.find(filters)
      .sort({ createdAt: -1 })
      .populate("createdBy", "username")
      .lean();

    return problems;
  } catch (error) {
    throw new Error(`Error searching problems: ${error.message}`);
  }
}
