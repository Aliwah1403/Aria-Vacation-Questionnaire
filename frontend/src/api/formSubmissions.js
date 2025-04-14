import apiClient from "@/lib/axios";

export const formSubmissionApi = {
  // getAll: async (params = {}) => {
  //   const { formCode } = params;

  //   const queryParams = new URLSearchParams();
  //   if (formCode) {
  //     queryParams.append("formCode", formCode);
  //   }

  //   const { data } = await apiClient.get("/api/v1/form-submission/get-all");
  //   return data.data.submissions;
  // },

  getAll: async ({ formCode } = {}) => {
    let url = "/api/v1/form-submission/get-all";
    if (formCode && formCode !== "all") {
      url += `?formCode=${formCode}`;
    }
    const { data } = await apiClient.get(url);
    return data.data.submissions;
  },

  // Get single submission by ID
  getById: async (id) => {
    const { data } = await apiClient.get(`/api/v1/form-submission/get/${id}`);
    return data.data;
  },

  // Create new submission
  create: async (submissionData) => {
    const { data } = await apiClient.post(
      "/api/v1/form-submission/add",
      submissionData
    );
    return data;
  },

  // Submit responses for a form
  submitResponses: async (id, responseData) => {
    const { data } = await apiClient.put(
      `/api/v1/form-submission/respond/${id}`,
      responseData
    );
    return data;
  },
};
