import apiClient from "@/lib/axios";

export const formTemplateApi = {
  getAll: async () => {
    const { data } = await apiClient.get("/api/v1/form-template/get");
    return data.data;
  },
  getByFormType: async (formCode) => {
    const { data } = await apiClient.get(
      `/api/v1/form-template/get?formCode=${formCode}`
    );
    return data.data;
  },
  create: async (templateData) => {
    const { data } = await apiClient.post(
      "/api/v1/form-template/add",
      templateData
    );
    return data;
  },
  update: async (id, templateData) => {
    const { data } = await apiClient.patch(
      `/api/v1/form-template/update/${id}`,
      templateData
    );
    return data;
  },
  delete: async (id) => {
    const { data } = await apiClient.delete(
      `/api/v1/form-template/delete/${id}`
    );
    return data;
  },
};
