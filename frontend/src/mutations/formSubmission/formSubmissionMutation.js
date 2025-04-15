import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formSubmissionApi } from "@/api/formSubmissions";

export const useCreateFormSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submitFormResponses"],
    mutationFn: formSubmissionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["formSubmissions"]);
    },
    onError: (error) => {
      console.log("Failed to create form submission", error.message);
      throw error;
    },
  });
};

export const useSubmitFormResponses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submitFormResponses"],
    mutationFn: ({ id, responseData }) =>
      formSubmissionApi.submitResponses(id, responseData),
    onSuccess: () => {
      queryClient.invalidateQueries(["formSubmissions"]);
    },
    onError: (error) => {
      console.error("Failed to submit form responses:", error);
      throw error;
    },
  });
};
