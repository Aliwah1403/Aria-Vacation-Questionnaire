import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formTypeApi } from "@/api/formTypes";

export const useCreateFormType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formTypeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formTypes"] });
    },
    onError: (error) => {
      console.error("Failed to create form type:", error);
    },
  });
};

export const useUpdateFormType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formTypeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["formTypes"]);
    },
    onError: (error) => {
      console.error("Failed to update form type:", error);
    },
  });
};

export const useDeleteFormType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formTypeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["formTypes"]);
    },
    onError: (error) => {
      console.error("Failed to delete form type:", error);
    },
  });
};
