import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [4, "Title length should be at least 4"],
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Description must be at least 20 characters long"],
    },
    inputFormat: {
      type: String,
      required: true,
    },
    outputFormat: {
      type: String,
      required: true,
    },
    constraints: {
      type: String,
      required: true,
    },
    sampleInput: {
      type: String,
      required: true,
    },
    sampleOutput: {
      type: String,
      required: true,
    },
    hiddenTestCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    tags: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);

export default Problem;
