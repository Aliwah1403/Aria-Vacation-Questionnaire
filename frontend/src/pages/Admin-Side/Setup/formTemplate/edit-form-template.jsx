import { useState, useEffect } from "react";
import { QuestionBuilder } from "./question-builder";
import { useUpdateFormTemplate } from "@/mutations/formTemplate/formTemplateMutations";
import { toast } from "sonner";

export function EditFormTemplate({ template, formTypes, onClose }) {
  // Find formType using formTypeId to get formCode
  const formType = formTypes.find((f) => f._id === template.formTypeId);
  const [selectedFormType] = useState(formType?.formCode);
  const [templateName] = useState(template.formTemplateName);
  const updateMutation = useUpdateFormTemplate();

  const handleSaveTemplate = (templateData) => {
    // Preserve question IDs and ensure order numbers
    const updatedQuestions = templateData.questions.map((question, index) => {
      const existingQuestion = template.questions.find(
        (q, i) => i === index // Match by index since we're updating in place
      );
      return {
        ...question,
        _id: existingQuestion?._id, // Preserve the original _id
        order: question.order || existingQuestion?.order || index + 1,
      };
    });

    updateMutation.mutate(
      {
        id: template._id,
        formTypeId: template.formTypeId, // Include formTypeId
        formCode: formType?.formCode, // Include formCode
        formTemplateName: templateData.formTemplateName,
        questions: updatedQuestions,
        ratingOptions: templateData.ratingOptions,
      },
      {
        onSuccess: () => {
          onClose();
          toast.success("Form template updated successfully");
        },
        onError: (error) => {
          console.error("Update error:", error);
          toast.error("Failed to update form template");
        },
      }
    );
  };

  const formTypeDetails = formTypes.find(
    (f) => f.formCode === template.formCode
  );

  return (
    <QuestionBuilder
      formTypeDetails={{
        [selectedFormType]: formTypeDetails,
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
