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

export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => emailTemplateApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["emailTemplates"]);
    },
    onError: (error) => {
      console.error("Failed to update email template: ", error);
    },
  });
};

export const useToggleEmailTemplateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => emailTemplateApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
    },
    onError: () => {
      console.error("Failed to toggle email template status");
    },
  });
};

export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emailTemplateApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["emailTemplates"]);
    },
    onError: (error) => {
      console.error("Failed to delete email template: ", error);
    },
  });
};
