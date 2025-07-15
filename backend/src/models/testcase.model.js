import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    input: {
      type: String,
      required: true,
      trim: true,
    },
    expectedOutput: {
      type: String,
      required: true,
      trim: true,
    },
    isHidden: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const TestCase =
  mongoose.models.TestCase || mongoose.model("TestCase", TestCaseSchema);

export default TestCase;
