import apiClient from "@/lib/axios";

export const emailTemplateApi = {
  getAll: async () => {
    const { data } = await apiClient.get("/api/v1/email-template/get");
    return data.data;
  },
};
