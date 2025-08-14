import TestCase from "../models/testcase.model.js";
import Problem from "../models/problem.model.js";

export const createTestCase = async (
  { problemId, input, expectedOutput, isPublic },
  user
) => {
  const problem = await Problem.findById(problemId);
  if (!problem) throw new Error("Problem not found");

  const userId = user.id;
  const isOwner = problem.createdBy.toString() === userId.toString();
  const isPrivileged =
    user.role?.includes("admin") || user.role?.includes("problemSetter");

  if (!isOwner && !isPrivileged) {
    throw new Error("You can only add test cases to your own problems");
  }
  const testCase = new TestCase({
    problemId,
    input,
    expectedOutput,
    isPublic: isPublic || false,
  });

  await testCase.save();

  return {
    success: true,
    message: "Test case created successfully",
    testCase,
  };
};


export const getTestCasesByProblemId = async (problemId, user, query) => {
  const { includePrivate, forSubmission } = query;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new Error("Problem not found");

  let q = { problemId };

  const userId = user?.id;
  const isOwner = user && problem.createdBy.toString() === userId.toString();
  const isPrivileged =
    user?.role?.includes("admin") || user?.role?.includes("problemSetter");

  
  const shouldIncludePrivate =
    user && 
    ((forSubmission === true) || 
     ((isOwner || isPrivileged) && includePrivate === true)); 

  if (!shouldIncludePrivate) {
    q.isPublic = true;
  }

  const testCases = await TestCase.find(q).sort({ createdAt: 1 });

  return {
    success: true,
    testCases,
    count: testCases.length,
  };
};

export const getAllTestCases = async ({ page = 1, limit = 10, problemId }) => {
  const skip = (page - 1) * limit;
  const query = problemId ? { problemId } : {};

  const testCases = await TestCase.find(query)
    .populate("problemId", "title difficulty")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await TestCase.countDocuments(query);

  return {
    success: true,
    testCases,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
export const updateTestCase = async (id, data, user) => {
  const testCase = await TestCase.findById(id).populate("problemId");
  if (!testCase) throw new Error("Test case not found");

  const userId = user?.id;
  const isOwner = testCase.problemId.createdBy.toString() === userId.toString();
  const isPrivileged =
    user.role?.includes("admin") || user.role?.includes("problemSetter");

  console.log("Update permission check:", {
    userId,
    problemCreatedBy: testCase.problemId.createdBy,
    isOwner,
    isPrivileged,
  });

  if (!isOwner && !isPrivileged) {
    throw new Error("You can only update test cases for your own problems");
  }

  const updated = await TestCase.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return {
    success: true,
    message: "Test case updated successfully",
    testCase: updated,
  };
};

export const deleteTestCase = async (id, user) => {
  const testCase = await TestCase.findById(id).populate("problemId");
  if (!testCase) throw new Error("Test case not found");

  const userId = user.id;
  const isOwner = testCase.problemId.createdBy.toString() === userId.toString();
  const isPrivileged =
    user.role?.includes("admin") || user.role?.includes("problemSetter");

  console.log("Delete permission check:", {
    userId,
    problemCreatedBy: testCase.problemId.createdBy,
    isOwner,
    isPrivileged,
  });

  if (!isOwner && !isPrivileged) {
    throw new Error("You can only delete test cases for your own problems");
  }

  await TestCase.findByIdAndDelete(id);

  return {
    success: true,
    message: "Test case deleted successfully",
  };
};
