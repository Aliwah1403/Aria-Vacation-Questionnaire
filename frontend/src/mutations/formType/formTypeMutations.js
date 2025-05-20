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
    mutationFn: ({ id, ...data }) => formTypeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formTypes"] });
    },
    onError: (error) => {
      console.error("Failed to update form type:", error);
    },
  });
};

export const useToggleFormTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => formTypeApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formTypes"] });
    },
    onError: () => {
      console.error("Failed to toggle form type status");
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
