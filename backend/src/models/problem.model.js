import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [4, "Title must be at least 4 characters long"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Description must be at least 20 characters long"],
      trim: true,
    },
    inputFormat: {
      type: String,
      required: true,
      trim: true,
    },
    outputFormat: {
      type: String,
      required: true,
      trim: true,
    },
    constraints: {
      type: String,
      required: true,
      trim: true,
    },
    sampleTestCases: [
      {
        input: { type: String, required: true, trim: true },
        expectedOutput: { type: String, required: true, trim: true },
        explanation: { type: String, trim: true },
      },
    ],

    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      lowercase: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
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
