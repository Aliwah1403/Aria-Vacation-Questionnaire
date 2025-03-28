import FormSubmission from "../models/formSubmission.model.js";
import FormTemplate from "../models/formTemplate.model.js";

export const addFormSubmission = async (req, res) => {
  try {
    const {
      formTemplateId,
      memberId,
      memberName,
      memberEmail,
      resort,
      unitNo,
      checkIn,
      checkOut,
    } = req.body;

    // Validate if form template exists
    const template = await FormTemplate.findById(formTemplateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Form template not found",
      });
    }

    // Initialize responses based on template questions
    const responses = template.questions.map((q) => ({
      questionId: q._id,
      question: q.questionText,
      response: "", // Placeholder, will be updated later
    }));

    // Create form submission
    const newSubmission = await FormSubmission.create({
      formTemplateId,
      memberId,
      memberName,
      memberEmail,
      resort,
      unitNo,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      status: "pending",
      sentAt: new Date(),
      responses, // Pre-filled with questions
    });

    // Populate template details in response
    const populatedSubmission = await FormSubmission.findById(
      newSubmission._id
    ).populate({
      path: "formTemplateId",
      populate: {
        path: "formTypeId",
      },
    });

    res.status(201).json({
      success: true,
      message: "Form submission created successfully",
      data: populatedSubmission,
    });
  } catch (error) {
    console.error("Error creating form submission:", error);
    res.status(500).json({
      success: false,
      message: "Error creating form submission",
      error: error.message,
    });
  }
};

export const formSubmissionResponses = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses, additionalComments, testimonialConsent } = req.body;

    // Find submission and populate template details for validation
    const submission = await FormSubmission.findById(id).populate({
      path: "formTemplateId",
      select: "questions ratingOptions",
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Form submission not found",
      });
    }

    const template = submission.formTemplateId;
    const validRatingOptions = template.ratingOptions.map(
      (option) => option.value
    );

    // Validate responses
    for (const response of responses) {
      // Find corresponding question in template
      const templateQuestion = template.questions.find(
        (q) => q._id.toString() === response.questionId.toString()
      );

      if (!templateQuestion) {
        return res.status(400).json({
          success: false,
          message: `Invalid question ID: ${response.questionId}`,
        });
      }

      if (!submission.viewedAt) {
        submission.viewedAt = new Date();
        submission.status = "viewed";
      }

      // Validate emoji responses against rating options
      if (
        templateQuestion.questionType === "emoji" &&
        !validRatingOptions.includes(response.response)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid response for question ${
            response.questionId
          }. Must be one of: ${validRatingOptions.join(", ")}`,
        });
      }
    }

    // Update submission with validated responses
    submission.responses = responses;
    submission.additionalComments = additionalComments || "";
    submission.testimonialConsent = testimonialConsent || false;
    submission.completedAt = new Date();
    submission.status = "completed";

    await submission.save();

    const updatedSubmission = await FormSubmission.findById(id).populate({
      path: "formTemplateId",
      populate: { path: "formTypeId" },
    });

    res.status(200).json({
      success: true,
      message: "Responses submitted successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating form submission:", error);
    res.status(500).json({
      success: false,
      message: "Error updating form submission",
      error: error.message,
    });
  }
};
