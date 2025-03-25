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

export const getFormType = async (req, res) => {
  try {
    const formTypes = await FormType.find()
      .sort({ createdAt: -1 })
      .select("-__v"); // Exclude version key

    if (!formTypes.length) {
      return res.status(404).json({
        success: false,
        message: "No form types found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form types retrieved successfully",
      count: formTypes.length,
      data: formTypes,
    });
  } catch (error) {
    console.error("Error retrieving form types:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving form types",
      error: error.message,
    });
  }
};

export const updateFormType = async (req, res) => {
  try {
    const { id } = req.params;
    const { formName, formDescription, isActive } = req.body;

    // Check if form exists
    const existingForm = await FormType.findById(id);
    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: "Form type not found",
      });
    }

    // Generate new formCode if formName is being updated
    const updateData = {
      formName,
      formDescription,
      isActive,
    };

    if (formName && formName !== existingForm.formName) {
      const newFormCode = formName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .trim();

      // Check if new formCode would conflict with existing ones
      const codeExists = await FormType.findOne({
        formCode: newFormCode,
        _id: { $ne: id }, // exclude current document
      });

      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: "Generated form code would conflict with existing form type",
        });
      }

      updateData.formCode = newFormCode;
    }

    // Update form type
    const updatedForm = await FormType.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    res.status(200).json({
      success: true,
      message: "Form type updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    console.error("Error updating form type:", error);
    res.status(500).json({
      success: false,
      message: "Error updating form type",
      error: error.message,
    });
  }
};
