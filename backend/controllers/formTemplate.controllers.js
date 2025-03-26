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

export const updateFormTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { questions, ratingOptions, isActive } = req.body;

    // Check if template exists
    const existingTemplate = await FormTemplate.findById(id);
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Form template not found",
      });
    }

    // Validate questions order if questions are being updated
    if (questions) {
      const orders = questions.map((q) => q.order);
      const hasDuplicateOrders = orders.length !== new Set(orders).size;
      if (hasDuplicateOrders) {
        return res.status(400).json({
          success: false,
          message: "Questions must have unique order numbers",
        });
      }
    }

    // Check if emoji questions exist and rating options are provided
    const updatedQuestions = questions || existingTemplate.questions;
    const hasEmojiQuestions = updatedQuestions.some(
      (q) => q.questionType === "emoji"
    );
    if (
      hasEmojiQuestions &&
      !ratingOptions?.length &&
      !existingTemplate.ratingOptions?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating options are required when using emoji questions",
      });
    }

    // Update template
    const updatedTemplate = await FormTemplate.findByIdAndUpdate(
      id,
      {
        questions: questions || existingTemplate.questions,
        ratingOptions: ratingOptions || existingTemplate.ratingOptions,
        isActive: isActive ?? existingTemplate.isActive,
      },
      { new: true, runValidators: true }
    )
      .populate("formTypeId", "formName formCode formDescription")
      .select("-__v");

    res.status(200).json({
      success: true,
      message: "Form template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating form template:", error);
    res.status(500).json({
      success: false,
      message: "Error updating form template",
      error: error.message,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { templateId, questionId } = req.params;
    const { questionText, questionType, required, order } = req.body;

    // Find template and verify it exists
    const template = await FormTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Form template not found",
      });
    }

    // Find the specific question
    const questionIndex = template.questions.findIndex(
      (q) => q._id.toString() === questionId
    );

    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found in template",
      });
    }

    // Check if order is being changed and validate uniqueness
    if (order && order !== template.questions[questionIndex].order) {
      const orderExists = template.questions.some(
        (q, idx) => idx !== questionIndex && q.order === order
      );
      if (orderExists) {
        return res.status(400).json({
          success: false,
          message: "Question order must be unique",
        });
      }
    }

    // Update the specific question
    template.questions[questionIndex] = {
      ...template.questions[questionIndex].toObject(),
      questionText:
        questionText || template.questions[questionIndex].questionText,
      questionType:
        questionType || template.questions[questionIndex].questionType,
      required: required ?? template.questions[questionIndex].required,
      order: order || template.questions[questionIndex].order,
    };

    // If changing to emoji type, verify rating options exist
    if (questionType === "emoji" && !template.ratingOptions?.length) {
      return res.status(400).json({
        success: false,
        message: "Rating options are required for emoji questions",
      });
    }

    // Save the updated template
    const updatedTemplate = await FormTemplate.findByIdAndUpdate(
      templateId,
      { questions: template.questions },
      { new: true, runValidators: true }
    )
      .populate("formTypeId", "formName formCode formDescription")
      .select("-__v");

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Error updating question",
      error: error.message,
    });
  }
};

export const deleteFormTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const existingTemplate = await FormTemplate.findById(id);
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Form template not found",
      });
    }

    await FormTemplate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Form template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form template:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting form template",
      error: error.message,
    });
  }
};
