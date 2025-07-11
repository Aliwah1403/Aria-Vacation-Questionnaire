import apiClient from "@/lib/axios";

export const formSubmissionApi = {
  getAll: async ({ formCode } = {}) => {
    let url = "/api/v1/form-submission/get-all";
    if (formCode && formCode !== "all") {
      url += `?formCode=${formCode}`;
    }
    const { data } = await apiClient.get(url);
    return data.data.submissions;
  },

  // Get single submission by ID
  getById: async (id, lang = "en") => {
    try {
      const { data } = await apiClient.get(
        `/api/v1/form-submission/get/${id}`,
        {
          params: { lng: lang },
        }
      );
      return data;
    } catch (error) {
      if (error.response?.status === 403) {
        // Return the error response data for completed forms
        return error.response.data;
      }
      if (error.response?.status === 404) {
        return error.response.data;
      }
      throw error; // Re-throw other errors
    }
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
      `/api/v1/form-submission/response/${id}`,
      responseData
    );
    return data;
  },
};
