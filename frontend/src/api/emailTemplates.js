import apiClient from "@/lib/axios";

export const emailTemplateApi = {
  getAll: async () => {
    const { data } = await apiClient.get("/api/v1/email-template/get");
    return data.data;
  },
  getByFormType: async (formCode) => {
    const { data } = await apiClient.get(
      `/api/v1/email-template/get?formCode=${formCode}`
    );
    return data.data;
  },
  create: async (templateData) => {
    const { data } = await apiClient.post(
      "/api/v1/email-template/add",
      templateData
    );
    return data;
  },
  update: async (id, templateData) => {
    const { data } = await apiClient.patch(
      `/api/v1/email-template/update/${id}`,
      templateData
    );
    return data;
  },
  delete: async (id) => {
    const { data } = await apiClient.delete(
      `/api/v1/email-template/delete/${id}`
    );
    return data;
  },
};
