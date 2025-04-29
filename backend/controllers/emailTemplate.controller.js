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
    const { formCode } = req.query;
    let query = {};

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

    const templates = await EmailTemplate.find(query)
      .populate("formTypeId", "formName formCode formDescription")
      .lean()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: templates.length
        ? "Email templates retrieved successfully"
        : "No email templates found",
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

export const updateEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      emailTemplateName,
      emailSubject,
      contentType,
      textContent,
      htmlContent,
      variables,
    } = req.body;

    const existingTemplate = await EmailTemplate.findById(id);
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Email template not found",
      });
    }

    // Check for name conflicts if name is being updated
    if (
      emailTemplateName &&
      emailTemplateName !== existingTemplate.emailTemplateName
    ) {
      const nameExists = await EmailTemplate.findOne({
        emailTemplateName,
        _id: { $ne: id },
      });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: "Template with this name already exists",
        });
      }
    }

    // Validate content based on contentType if being updated
    if (contentType === "text" && textContent === "") {
      return res.status(400).json({
        success: false,
        message: "Text content cannot be empty for text templates",
      });
    }

    if (contentType === "html" && htmlContent === "") {
      return res.status(400).json({
        success: false,
        message: "HTML content cannot be empty for HTML templates",
      });
    }

    // Prepare update object with only changed fields
    const updateData = {};
    if (emailTemplateName) updateData.emailTemplateName = emailTemplateName;
    if (emailSubject) updateData.emailSubject = emailSubject;
    if (contentType) {
      updateData.contentType = contentType;
      // Reset content fields based on new content type
      if (contentType === "text") {
        updateData.textContent = textContent;
        updateData.htmlContent = undefined;
      } else {
        updateData.htmlContent = htmlContent;
        updateData.textContent = undefined;
      }
    } else {
      // Update content without changing type
      if (
        textContent !== undefined &&
        existingTemplate.contentType === "text"
      ) {
        updateData.textContent = textContent;
      }
      if (
        htmlContent !== undefined &&
        existingTemplate.contentType === "html"
      ) {
        updateData.htmlContent = htmlContent;
      }
    }
    if (variables) updateData.variables = variables;

    // Update the template
    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("formTypeId", "formName formCode formDescription");

    return res.status(200).json({
      success: true,
      message: "Email template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating email template: ", error);
    return res.status(500).json({
      success: false,
      message: "Error updating email template",
      error: error.message,
    });
  }
};

export const deleteEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTemplate = await EmailTemplate.findById(id);
    if (!existingTemplate) {
      return res.status(400).json({
        success: false,
        message: "Email template not found",
      });
    }

    await EmailTemplate.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Email template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting email template", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting email template",
      error: error.message,
    });
  }
};
