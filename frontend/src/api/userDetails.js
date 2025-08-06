import apiClient from "@/lib/axios";

export const userDetailsApi = {
  getDetails: async (userId) => {
    const { data } = await apiClient.get(`/api/v1/users/get/${userId}`);
    return data;
  },
  updateDetails: async (userId, userData) => {
    const { data } = await apiClient.patch(
      `api/v1/users/update/${userId}`,
      userData
    );
    return data;
  },
};
