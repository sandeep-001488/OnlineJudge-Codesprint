import {
  createTestCase,
  getTestCasesByProblemId,
  getAllTestCases,
  updateTestCase,
  deleteTestCase,
} from "../services/testcase.service.js";

export const createTestCaseController = async (req, res) => {
  try {
    const result = await createTestCase(req.body, req.user);
    res.status(201).json(result);
  } catch (error) {
    console.error("Create test case error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getTestCasesByProblemIdController = async (req, res) => {
  try {
    const queryParams = {
      includePrivate: req.query.includePrivate === "true",
      limit: parseInt(req.query.limit) || 1000,
      page: parseInt(req.query.page) || 1,
    };

    const result = await getTestCasesByProblemId(
      req.params.problemId,
      req.user,
      queryParams
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Get test cases by problem ID error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllTestCasesController = async (req, res) => {
  try {
    const queryWithDefaults = {
      limit: parseInt(req.query.limit) || 1000,
      page: parseInt(req.query.page) || 1,
      problemId: req.query.problemId,
    };

    const result = await getAllTestCases(queryWithDefaults);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get all test cases error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateTestCaseController = async (req, res) => {
  try {
    const result = await updateTestCase(req.params.id, req.body, req.user);
    res.status(200).json(result);
  } catch (error) {
    console.error("Update test case error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteTestCaseController = async (req, res) => {
  try {
    const result = await deleteTestCase(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete test case error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
