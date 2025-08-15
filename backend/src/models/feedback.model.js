import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    university: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "University name cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [
        600,
        "Feedback content cannot exceed 600 characters (approximately 100 words)",
      ],
      minlength: [10, "Feedback content must be at least 10 characters long"],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "Rating must be a whole number",
      },
    },
    avatar: {
      type: String,
      default: function () {
        return this.name.charAt(0).toUpperCase();
      },
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ isVisible: 1, createdAt: -1 });

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
