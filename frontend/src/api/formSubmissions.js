import apiClient from "@/lib/axios";

export const formSubmissionApi = {
  getAll: async () => {
    const { data } = await apiClient.get("/api/v1/form-submission/get-all");
    return data.data.submissions;
  },
};
