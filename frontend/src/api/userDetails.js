import apiClient from "@/lib/axios";

export const userDetailsApi = {
  getDetails: async (userId) => {
    const { data } = await apiClient.get(`/api/v1/users/get/${userId}`);
    return data;
  },
};
