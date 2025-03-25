import mongoose from "mongoose";

// Define emoji codes mapped to scores
const EMOJI_SCORES = {
  5: "1f603", // Satisfied - 😃
  4: "1f642", // Somewhat Satisfied - 🙂
  3: "1f610", // Neutral - 😐
  2: "1f641", // Somewhat Dissatisfied - 🙁
  1: "1f614", // Very Dissatisfied - 😔
};

const formTemplateSchema = new mongoose.Schema(
  {
    formTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormType",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
          trim: true,
        },
        questionType: {
          type: String,
          enum: ["emoji", "text"],
          required: true,
          trim: true,
        },
        required: {
          type: Boolean,
          default: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    ratingOptions: [
      {
        value: {
          type: String,
          required: true,
          trim: true,
        },
        score: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
          validate: {
            validator: function (v) {
              return Number.isInteger(v);
            },
            message: "Score must be a whole number between 1 and 5",
          },
        },
        emoji: {
          type: String,
          required: true,
          default: function () {
            return EMOJI_SCORES[this.score];
          },
        },
      },
    ],
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Ensure at least one rating option exists if there are emoji questions
formTemplateSchema.pre("save", function (next) {
  if (
    this.questions.some((q) => q.questionType === "emoji") &&
    !this.ratingOptions?.length
  ) {
    next(new Error("Rating options are required when using emoji questions"));
  }
  next();
});

const FormTemplate = mongoose.model("FormTemplate", formTemplateSchema);

export default FormTemplate;
