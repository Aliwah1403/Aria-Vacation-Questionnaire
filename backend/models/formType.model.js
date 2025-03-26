import mongoose from "mongoose";

const formTypeSchema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
      trim: true,
    },
    formCode: {
      type: String,
      required: true,
      unique: true,
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

const FormType = mongoose.model("FormType", formTypeSchema);

export default FormType;
