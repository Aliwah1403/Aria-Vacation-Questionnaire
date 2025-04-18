import EmailTemplate from "../models/emailTemplate.model.js";
import FormType from "../models/formType.model.js";

export const addEmailTemplate = async (req, res) => {
  try {
    const {
      formCode,
      emailTemplateName,
      emailSubject,
      contentType,
      textContent,
      htmlContent,
      variables,
    } = req.body;

    //   Find form type by its code
    const formType = await FormType.findOne({ formCode, isActive: true });
    if (!formType) {
      return res.status(404).json({
        success: false,
        message: "No active form type with this code was found",
      });
    }

    // check if a template with same name exixsts
    const templateExists = await EmailTemplate.findOne({ emailTemplateName });
    if (templateExists) {
      return res.status(400).json({
        success: false,
        error: "Template with this name already exists",
      });
    }

    // Validate content based on contentType
    if (contentType === "text" && !textContent) {
      return res.status(400).json({
        success: false,
        error: "Text content is required for text templates",
      });
    }

    if (contentType === "html" && !htmlContent) {
      return res.status(400).json({
        success: false,
        error: "HTML content is required for HTML templates",
      });
    }

    const emailTemplate = await EmailTemplate.create({
      formTypeId: formType._id,
      formTypeName: formType.formName,
      emailTemplateName,
      emailSubject,
      contentType,
      textContent: contentType === "text" ? textContent : undefined,
      htmlContent: contentType === "html" ? htmlContent : undefined,
      variables: variables || [],
    });

    res.status(201).json({
      sucess: true,
      message: "Email template created successfully",
      data: emailTemplate,
    });
  } catch (error) {
    console.error("Error creating email template: ", error);
    res.status(500).json({
      success: false,
      message: "Error creating email template",
      error: error.message,
    });
  }
};

export const getEmailTemplate = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });

    if (!templates.length) {
      return res.status(400).json({
        success: false,
        message: "No email templates found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email templates retrieved successfully",
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.log("Error retrieving email templates: ", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving email templates",
      error: error.message,
    });
  }
};
