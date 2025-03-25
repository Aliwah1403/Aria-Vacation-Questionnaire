import FormType from "../models/formTypeModel.js";

export const addFormType = async (req, res) => {
  try {
    const { formName, formCode, formDescription } = req.body;

    // Check if form type already exists
    const existingForm = await FormType.findOne({ formCode });
    if (existingForm) {
      return res.status(400).json({
        success: false,
        message: "Form type with this code already exists",
      });
    }

    // Create new form type
    const newFormType = await FormType.create({
      formName,
      formCode,
      formDescription,
    });

    res.status(201).json({
      success: true,
      message: "Form type created successfully",
      data: newFormType,
    });
  } catch (error) {
    console.error("Error creating form type:", error);
    res.status(500).json({
      success: false,
      message: "Error creating form type",
      error: error.message,
    });
  }
};
