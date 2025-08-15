import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Suggestion message cannot exceed 1000 characters"],
      minlength: [10, "Suggestion message must be at least 10 characters long"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "implemented", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

SuggestionSchema.index({ createdAt: -1 });
SuggestionSchema.index({ status: 1, createdAt: -1 });

const Suggestion =
  mongoose.models.Suggestion || mongoose.model("Suggestion", SuggestionSchema);

export default Suggestion;
