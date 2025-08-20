import { userDetailsApi } from "@/api/userDetails";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateUserDetails = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => userDetailsApi.updateDetails(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetails", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to update user details: ", error);
    },
  });
};
