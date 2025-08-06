import { userDetailsApi } from "@/api/userDetails";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateUserDetails = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, ...data }) =>
      userDetailsApi.updateDetails(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetails", userId] });
    },
    onError: (error) => {
      console.error("Failed to update user details: ", error);
    },
  });
};
