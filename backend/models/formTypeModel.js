import mongoose from "mongoose";

const formTypeSchema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
    },
    formCode: {
      type: String,
      required: true,
    },
    formDescription: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("formType", formTypeSchema);
