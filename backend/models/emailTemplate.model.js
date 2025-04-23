import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    formTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormType",
      required: true,
    },
    formTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    emailTemplateName: {
      type: String,
      required: true,
      trim: true,
    },
    emailSubject: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ["text", "html"],
      required: true,
      default: "text",
    },
    textContent: {
      type: String,
      required: function () {
        return this.contentType === "text";
      },
    },
    htmlContent: {
      type: String,
      required: function () {
        return this.contentType === "html";
      },
    },
    //   emailContent: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //   },
    //   isHtml: {
    //     type: Boolean,
    //     default: false,
    //   },

    variables: [
      {
        name: String,
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
