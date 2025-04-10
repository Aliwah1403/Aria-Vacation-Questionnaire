import apiClient from "@/lib/axios";

export const formTypeApi = {
  getAll: async () => {
    const { data } = await apiClient.get("/api/v1/form-type/get");
    return data.data;
  },
  create: async (formData) => {
    const { data } = await apiClient.post("/api/v1/form-type/add", formData);
    return data;
  },
  update: async ({ id, formData }) => {
    const { data } = await apiClient.put(
      `/api/v1/form-type/update/${id}`,
      formData
    );
    return data;
  },
  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/v1/form-type/delete/${id}`);
    return data;
  },
};
