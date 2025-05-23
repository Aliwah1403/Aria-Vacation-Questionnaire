import { useState, useEffect } from "react";
import { QuestionBuilder } from "./question-builder";
import { useUpdateFormTemplate } from "@/mutations/formTemplate/formTemplateMutations";
import { toast } from "sonner";

export function EditFormTemplate({ template, formTypes, onClose }) {
  const formType = formTypes.find((f) => f._id === template.formTypeId);
  const [selectedFormType] = useState(formType?.formCode);
  const [templateName, setTemplateName] = useState(template.formTemplateName); // Make templateName stateful
  const updateMutation = useUpdateFormTemplate();


  const handleSaveTemplate = (templateData) => {
    const updatedQuestions = templateData.questions.map((question, index) => {
      const existingQuestion = template.questions.find((q, i) => i === index);
      return {
        ...question,
        _id: existingQuestion?._id,
        order: question.order || existingQuestion?.order || index + 1,
      };
    });

    updateMutation.mutate(
      {
        id: template._id,
        formTypeId: template.formTypeId,
        formCode: formType?.formCode,
        formTemplateName: templateData.formTemplateName || templateName, // Use fallback
        questions: updatedQuestions,
        ratingOptions: template.ratingOptions, // Use existing rating options instead
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

  const formTypeDetails = formTypes.find((f) => f._id === template.formTypeId);

  return (
    <QuestionBuilder
      formTypeDetails={{
        [selectedFormType]: formTypeDetails,
      }}
      mutation={updateMutation}
      selectedFormType={selectedFormType}
      templateName={templateName}
      setTemplateName={setTemplateName} // Add this prop
      initialQuestions={template.questions}
      initialRatingOptions={template.ratingOptions}
      isEditing={true}
      onSave={handleSaveTemplate}
      onCancel={onClose}
    />
  );
}
