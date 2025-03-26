import FormTemplate from "../models/formTemplate.model.js";
import FormType from "../models/formType.model.js";

export const addFormTemplate = async (req, res) => {
  try {
    const { formCode, questions, ratingOptions } = req.body;

    // Find form type by code
    const formType = await FormType.findOne({ formCode, isActive: true });
    if (!formType) {
      return res.status(404).json({
        success: false,
        message: "Active form type not found with this code",
      });
    }

    // Validate questions order
    const orders = questions.map((q) => q.order);
    const hasDuplicateOrders = orders.length !== new Set(orders).size;
    if (hasDuplicateOrders) {
      return res.status(400).json({
        success: false,
        message: "Questions must have unique order numbers",
      });
    }

    // Check if emoji questions exist and rating options are provided
    const hasEmojiQuestions = questions.some((q) => q.questionType === "emoji");
    if (hasEmojiQuestions && (!ratingOptions || ratingOptions.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Rating options are required when using emoji questions",
      });
    }

    // Create form template with found formTypeId
    const newFormTemplate = await FormTemplate.create({
      formTypeId: formType._id,
      formTypeName: formType.formName,
      questions,
      ratingOptions,
    });

    // Populate form type details in response
    const populatedTemplate = await FormTemplate.findById(newFormTemplate._id)
      .populate("formTypeId", "formName formCode formDescription")
      .select("-__v");

    res.status(201).json({
      success: true,
      message: "Form template created successfully",
      data: populatedTemplate,
    });
  } catch (error) {
    console.error("Error creating form template:", error);
    res.status(500).json({
      success: false,
      message: "Error creating form template",
      error: error.message,
    });
  }
};

export const getFormTemplate = async (req, res) => {
  try {
    const { formCode } = req.query;
    let query = {};

    // If formCode provided, filter by form type
    if (formCode) {
      const formType = await FormType.findOne({ formCode });
      if (!formType) {
        return res.status(404).json({
          success: false,
          message: "Form type not found",
        });
      }
      query.formTypeId = formType._id;
    }

    // Fetch templates with populated form type details
    const templates = await FormTemplate.find(query)
      .populate("formTypeId", "formName formCode formDescription")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!templates.length) {
      return res.status(404).json({
        success: false,
        message: formCode
          ? `No templates found for form type: ${formCode}`
          : "No templates found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form templates retrieved successfully",
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("Error retrieving form templates:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving form templates",
      error: error.message,
    });
  }
};
