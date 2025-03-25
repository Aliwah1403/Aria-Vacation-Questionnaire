import mongoose from "mongoose";

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
        // maxLength: {
        //   type: Number,
        //   default: 4000,
        //   validate: {
        //     validator: function (v) {
        //       return this.questionType === "text" ? v > 0 : true;
        //     },
        //     message: "Maximum length must be greater than 0 for text questions",
        //   },
        // },
      },
    ],
    ratingOptions: [
      {
        value: {
          type: String,
          required: true,
          trim: true,
        },
        emoji: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
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
