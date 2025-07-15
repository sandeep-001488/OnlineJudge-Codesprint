import mongoose from "mongoose";

const LeaderBoardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    problemSolved: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const LeaderBoard =
  mongoose.models.LeaderBoard ||
  mongoose.model("LeaderBoard", LeaderBoardSchema);

export default LeaderBoard;
