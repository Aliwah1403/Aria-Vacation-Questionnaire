import FormTemplate from "../models/formTemplate.model.js";
import FormType from "../models/formType.model.js";

const validateMultilingualContent = (content, fieldName) => {
  const requiredLanguages = ["en", "fr", "ar", "ru"];
  const missingLanguages = requiredLanguages.filter(
    (lang) => !content[lang]?.trim()
  );

  if (missingLanguages.length > 0) {
    throw new Error(
      `${fieldName} is missing translations for: ${missingLanguages.join(", ")}`
    );
  }
};

export const addFormTemplate = async (req, res) => {
  try {
    const { formCode, formTemplateName, questions, ratingOptions } = req.body;

    // Validate questions content
    questions.forEach((question, index) => {
      try {
        validateMultilingualContent(
          question.questionText,
          `Question ${index + 1} text`
        );
      } catch (error) {
        throw new Error(`Question ${index + 1}: ${error.message}`);
      }
    });

    // Validate rating options if emoji questions exist
    if (questions.some((q) => q.questionType === "emoji")) {
      ratingOptions?.forEach((option, index) => {
        try {
          validateMultilingualContent(
            option.value,
            `Rating option ${index + 1}`
          );
        } catch (error) {
          throw new Error(`Rating option ${index + 1}: ${error.message}`);
        }
      });
    }

    // Find form type by code
    const formType = await FormType.findOne({ formCode, isActive: true });
    if (!formType) {
      return res.status(404).json({
        success: false,
        message: "No active form type with this code was found",
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
      formTemplateName: formTemplateName || formType.formName,
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

    let updatedQuestions = [...existingTemplate.questions]; // Create copy of existing questions

    if (questions) {
      // Check if we're adding new questions or updating existing ones
      questions.forEach((newQuestion) => {
        const existingIndex = updatedQuestions.findIndex(
          (q) => q._id?.toString() === newQuestion._id
        );

        if (existingIndex !== -1) {
          // Update existing question
          updatedQuestions[existingIndex] = {
            ...updatedQuestions[existingIndex].toObject(),
            ...newQuestion,
          };
        } else {
          // Add new question
          updatedQuestions.push(newQuestion);
        }
      });

      // Validate order numbers
      const orders = updatedQuestions.map((q) => q.order);
      const hasDuplicateOrders = orders.length !== new Set(orders).size;
      if (hasDuplicateOrders) {
        return res.status(400).json({
          success: false,
          message: "Questions must have unique order numbers",
        });
      }
    }

    // Check if emoji questions exist and rating options are provided
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

    let updatedRatingOptions = [...existingTemplate.ratingOptions]; // Create copy

    if (ratingOptions) {
      ratingOptions.forEach((newOption) => {
        const existingIndex = updatedRatingOptions.findIndex(
          (o) => o._id?.toString() === newOption._id
        );

        if (existingIndex !== -1) {
          // Update existing option
          updatedRatingOptions[existingIndex] = {
            ...updatedRatingOptions[existingIndex].toObject(),
            ...newOption,
          };
        } else {
          // Add new option
          updatedRatingOptions.push(newOption);
        }
      });

      // Validate scores are unique
      const scores = updatedRatingOptions.map((o) => o.score);
      const hasDuplicateScores = scores.length !== new Set(scores).size;
      if (hasDuplicateScores) {
        return res.status(400).json({
          success: false,
          message: "Rating options must have unique scores",
        });
      }
    }

    // Update template
    const updatedTemplate = await FormTemplate.findByIdAndUpdate(
      id,
      {
        questions: updatedQuestions,
        ratingOptions: updatedRatingOptions,
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
