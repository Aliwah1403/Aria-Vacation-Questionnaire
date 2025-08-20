import FormSubmission from "../models/formSubmission.model.js";
import FormTemplate from "../models/formTemplate.model.js";
import FormType from "../models/formType.model.js";

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
      language,
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
      question: q.questionText.en,
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
      language: language || "en",
      status: "pending",
      sentAt: new Date(),
      responses, // Pre-filled with questions
    });

    const BASE_URL = process.env.FRONTEND_URL;
    // const formType = template.formTypeName.toLowerCase().replace(/\s+/g, "_");
    const feedbackUrl = `${BASE_URL}/${newSubmission.id}/?lng=${language}`;

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
      feedbackUrl: feedbackUrl,
      language: language,
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

export const getFormSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { lng = "en" } = req.query; // Default to English if no language specified

    // Populate template details
    const submission = await FormSubmission.findById(id).populate({
      path: "formTemplateId",
      select: "questions ratingOptions formTypeName",
      populate: {
        path: "formTypeId",
        select: "formName formCode",
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Form submission not found",
      });
    }

    // Check if feedback is already completed
    if (submission.status === "completed") {
      return res.status(403).json({
        success: false,
        message:
          "Thank you for your feedback. You have already completed this survey.",
        data: {
          completedAt: submission.completedAt,
          memberName: submission.memberName,
          resort: submission.resort,
          checkOut: submission.checkOut,
        },
      });
    }

    // If not completed, mark as viewed if first time
    if (!submission.viewedAt) {
      submission.viewedAt = new Date();
      submission.status = "viewed";
      await submission.save();
    }

    // Transform questions and rating options to use specified language
    const localizedQuestions = submission.formTemplateId.questions.map((q) => ({
      ...q.toObject(),
      questionText: q.questionText[lng] || q.questionText.en, // Fallback to English
    }));

    const localizedRatingOptions = submission.formTemplateId.ratingOptions?.map(
      (option) => ({
        ...option.toObject(),
        value: option.value[lng] || option.value.en, // Fallback to English
      })
    );

    // Update responses with localized questions
    const localizedResponses = submission.responses.map((response) => {
      const question = localizedQuestions.find(
        (q) => q._id.toString() === response.questionId.toString()
      );
      return {
        ...response.toObject(),
        question: question?.questionText || response.question,
      };
    });

    const responseData = {
      memberDetails: {
        name: submission.memberName,
        email: submission.memberEmail,
        memberId: submission.memberId,
        resort: submission.resort,
        unitNo: submission.unitNo,
        checkIn: submission.checkIn,
        checkOut: submission.checkOut,
      },
      formDetails: {
        formType: submission.formTemplateId.formTypeName,
        questions: localizedQuestions,
        ratingOptions: localizedRatingOptions,
      },
      status: submission.status,
      responses: localizedResponses,
      language: lng,
    };

    res.status(200).json({
      success: true,
      message: "Form submission retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching form submission:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching form submission",
      error: error.message,
    });
  }
};

export const getAllFormSubmissions = async (req, res) => {
  try {
    const { formCode } = req.query;

    // Build base query
    let query = {};

    if (formCode) {
      // First find the form type by code
      const formType = await FormType.findOne({ formCode });
      if (formType) {
        // Find templates of this form type
        const templates = await FormTemplate.find({ formTypeId: formType._id });
        const templateIds = templates.map((template) => template._id);

        // Add template filter to main query
        query.formTemplateId = { $in: templateIds };
      }
    }

    // Execute query with population
    const submissions = await FormSubmission.find(query)
      .populate({
        path: "formTemplateId",
        select: "formTypeName questions",
        populate: {
          path: "formTypeId",
          select: "formName formCode",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Form submissions retrieved successfully",
      data: {
        submissions,
        pagination: {
          total: submissions.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching form submissions",
      error: error.message,
    });
  }
};

export const formSubmissionResponses = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses, testimonialConsent, language } = req.body;

    if (!Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "Responses must be an array",
      });
    }

    // Find submission and validate
    const submission = await FormSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Form submission not found",
      });
    }

    if (submission.status === "completed") {
      return res.status(403).json({
        success: false,
        message: "This feedback form has already been submitted.",
        data: {
          completedAt: submission.completedAt,
          memberName: submission.memberName,
        },
      });
    }

    // Find template
    const template = await FormTemplate.findById(submission.formTemplateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Associated form template not found",
      });
    }

    // Validate responses
    for (const response of responses) {
      const templateQuestion = template.questions.find(
        (q) => q._id.toString() === response.questionId
      );

      if (!templateQuestion) {
        return res.status(400).json({
          success: false,
          message: `Question with ID ${response.questionId} not found in template`,
        });
      }

      // Handle emoji responses
      if (templateQuestion.questionType === "emoji") {
        const validValues = template.ratingOptions.map(
          (opt) => opt.value[language] || opt.value.en
        );
        if (!validValues.includes(response.response)) {
          return res.status(400).json({
            success: false,
            message: `Invalid response for question ${response.questionId}`,
            validOptions: validValues,
          });
        }
      }

      // Store comments in additionalComments
      if (templateQuestion.questionType === "comments") {
        submission.additionalComments = response.response;
      }
    }

    // Calculate average rating from emoji responses
    const emojiResponses = responses.filter((response) => {
      const question = template.questions.find(
        (q) => q._id.toString() === response.questionId
      );
      return question?.questionType === "emoji";
    });

    if (emojiResponses.length > 0) {
      const scores = emojiResponses.map((response) => {
        // Find the rating option that matches the response in any language
        const ratingOption = template.ratingOptions.find((opt) =>
          Object.values(opt.value).includes(response.response)
        );
        return ratingOption?.score || 0;
      });

      submission.averageRating =
        scores.reduce((acc, score) => acc + score, 0) / scores.length;
    }

    // Update submission with responses and calculated rating
    submission.responses = responses;
    submission.testimonialConsent = testimonialConsent;
    submission.completedAt = new Date();
    submission.status = "completed";

    await submission.save();

    // Get fully populated submission for response
    const updatedSubmission = await FormSubmission.findById(id).populate({
      path: "formTemplateId",
      populate: { path: "formTypeId" },
    });

    console.log(updatedSubmission);

    res.status(200).json({
      success: true,
      message:
        "Thank you for your feedback! Your responses have been submitted successfully.",
      data: submission,
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
