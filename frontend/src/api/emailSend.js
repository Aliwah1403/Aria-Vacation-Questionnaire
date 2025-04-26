import apiClient from "@/lib/axios";

export const emailSendApi = {
    sendFeedbackEmail: async (emailData) => {
        const { data } = await apiClient.post(
          "/api/v1/email-send/send-feedback",
          emailData
        );
        return data;
    },
}