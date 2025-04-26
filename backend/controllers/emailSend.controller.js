import { sendMail } from "../services/emailService.js";

export const sendFeedbackEmail = async (req, res) => {
  try {
    const {
      recepientEmail,
      recepientName,
      subject,
      contentType,
      rawContent,
      templateVariables,
    } = req.body;

    // Include actual values of template variables
    let processedMail = rawContent;
    Object.entries(templateVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      processedMail = processedMail.replace(regex, value);
    });

    await sendMail({
      to: recepientEmail,
      subject,
      [contentType === "html" ? "html" : "text"]: processedMail,
    });
    res.status(200).json({
      success: true,
      message: "Feedback email sent successfully",
    });
  } catch (error) {
    console.error("Error sending feedback email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending feedback email",
      error: error.message,
    });
  }
};
