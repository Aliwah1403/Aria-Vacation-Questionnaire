import { useState, useEffect } from "react";
import { QuestionBuilder } from "./question-builder";
import { useUpdateFormTemplate } from "@/mutations/formTemplate/formTemplateMutations";
import { toast } from "sonner";

export function EditFormTemplate({ 
  template, 
  formTypes, 
  onClose 
}) {
  const [selectedFormType] = useState(template.formCode);
  const [templateName] = useState(template.formTemplateName);
  const updateMutation = useUpdateFormTemplate();

  const handleSaveTemplate = (templateData) => {
    updateMutation.mutate(
      { 
        id: template._id, 
        ...templateData 
      },
      {
        onSuccess: () => {
          onClose();
          toast.success("Form template updated successfully");
        },
        onError: () => {
          toast.error("Failed to update form template");
        },
      }
    );
  };

  const formTypeDetails = formTypes.find(f => f.formCode === template.formCode);

  return (
    <QuestionBuilder
      formTypeDetails={{
        [selectedFormType]: formTypeDetails
      }}
      mutation={updateMutation}
      selectedFormType={selectedFormType}
      templateName={templateName}
      initialQuestions={template.questions}
      initialRatingOptions={template.ratingOptions}
      onSave={handleSaveTemplate}
      onCancel={onClose}
    />
  );
}