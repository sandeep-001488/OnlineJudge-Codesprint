import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  searchProblems,
} from "../services/problem.service.js";

export async function createProblemController(req, res) {
  try {
    const problem = await createProblem(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Problem created",
      problem,
    });
} catch (err) {
    console.error("Create problem error:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getAllProblemsController(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const difficulty = req.query.difficulty;
    const tag = req.query.tag;

    const filters = {};
    if (difficulty && difficulty !== "all") {
      filters.difficulty = difficulty;
    }
    if (tag && tag !== "all") {
      filters.tags = { $in: [tag] };
    }

    const skip = (page - 1) * limit;

    const result = await getAllProblems(filters, skip, limit);

    res.status(200).json({
      success: true,
      problems: result.problems,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (err) {
    console.error("Get all problems error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching problems",
    });
  }
}

export async function getProblemByIdController(req, res) {
  try {
    const problem = await getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }
    res.status(200).json({
      success: true,
      problem,
    });
  } catch (err) {
    console.error("Get problem by ID error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateProblemController(req, res) {
  try {
    const updated = await updateProblem(req.params.id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: "Problem updated",
      problem: updated,
    });
  } catch (error) {
    console.error("Update problem error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteProblemController(req, res) {
  try {
    await deleteProblem(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Delete problem error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function searchProblemController(req, res) {
  try {
    const { q, difficulty, tag } = req.query;

    // Build search filters
    const filters = {};
    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }
    if (difficulty && difficulty !== "all") {
      filters.difficulty = difficulty;
    }
    if (tag && tag !== "all") {
      filters.tags = { $in: [tag] };
    }

    const problems = await searchProblems(filters);
    res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error("Search problems error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
