import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailTemplateApi } from "@/api/emailTemplates";

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emailTemplateApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["emailTemplates"]);
    },
    onError: (error) => {
      console.error("Failed to create email template: ", error);
    },
  });
};
