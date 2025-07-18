import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formTemplateApi } from "@/api/formTemplates";

export const useCreateFormTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formTemplateApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["formTemplates"]);
    },
    onError: (error) => {
      console.error("Failed to create form template:", error);
    },
  });
};

export const useUpdateFormTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => formTemplateApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["formTemplates"]);
    },
    onError: (error) => {
      console.error("Failed to update form template:", error);
    },
  });
};

export const useToggleFormTemplateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => formTemplateApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formTemplates"] });
    },
    onError: () => {
      console.error("Failed to toggle form template status");
    },
  });
};

export const useDeleteFormTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formTemplateApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["formTemplates"]);
    },
    onError: (error) => {
      console.error("Failed to delete form template:", error);
    },
  });
};
