import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    formTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormTemplate",
      required: true,
    },

    // Member details
    memberId: {
      type: String,
      required: true,
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    memberEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },

    // Stay details
    resort: {
      type: String,
      required: true,
      trim: true,
    },
    unitNo: {
      type: String,
      required: true,
      trim: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },

    // Access and status
    status: {
      type: String,
      enum: ["pending", "viewed", "completed"],
      default: "pending",
    },

    // Tracking Dates
    sentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    viewedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },

    //Responses
    responses: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        response: {
          type: String,
          required: true,
        },
      },
    ],
    additionalComments: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
formSubmissionSchema.index({ memberId: 1, status: 1 });
formSubmissionSchema.index({ resort: 1, checkIn: -1 });

// Virtual for calculating stay duration
formSubmissionSchema.virtual("stayDuration").get(function () {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Status update middleware
formSubmissionSchema.pre("save", function (next) {
  if (this.completedAt) {
    this.status = "completed";
  } else if (this.viewedAt) {
    this.status = "viewed";
  }
  next();
});

// Validation for check-in/check-out dates
formSubmissionSchema.path("checkOut").validate(function (value) {
  return this.checkIn < value;
}, "Check-out date must be after check-in date");

const FormSubmission = mongoose.model("FormSubmission", formSubmissionSchema);

export default FormSubmission;
