import React from "react";
import AdminPageHeader from "@/components/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormTypeTable } from "./formType/form-type-table";
import { formTypeColumns } from "./formType/columns";
import { formTemplateColumns } from "./formTemplate/columns";
import { FormTemplateTable } from "./formTemplate/form-template-table";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { formTypeApi } from "@/api/formTypes";
import { formTemplateApi } from "@/api/formTemplates";
import { EmailTemplateTable } from "./Email Contents/email-template-table";
import { emailTemplateColumns } from "./Email Contents/columns";
import { emailTemplateApi } from "@/api/emailTemplates";
import { LoaderComponent } from "@/components/data-loader";

const formTemplates = [
  {
    id: 1,
    formTemplateName: "Stay Experience Survey",
    formTypeName: "Stay Experience Survey",
    questions: 10,
    updatedAt: "07/04/2024",
    isActive: true,
  },
  {
    id: 2,
    formTemplateName: "Pool and Spa Feedback",
    formTypeName: "Amenities Feedback",
    questions: 8,
    updatedAt: "05/04/2024",
    isActive: true,
  },
  {
    id: 3,
    formTemplateName: "Front Desk Service Survey",
    formTypeName: "Customer Service Rating",
    questions: 12,
    updatedAt: "06/04/2024",
    isActive: true,
  },
  {
    id: 4,
    formTemplateName: "Resort Experience Review",
    formTypeName: "Post-Stay Survey",
    questions: 15,
    updatedAt: "08/04/2024",
    isActive: false,
  },
];

const emailTemplates = [
  {
    id: 1,
    formTypeName: "Stay Experience Survey",
    emailTemplateName: "Stay Experience Email",
    emailSubjectLine: "Your Stay Experience Feedback",
    isHtml: false,
    isActive: true,
    createdAt: "08/04/2024",
    updatedAt: "08/04/2024",
    emailContent:
      "We value your feedback on your recent stay. Please take a moment to complete our survey",
  },
];

const QuestionnaireSetup = () => {
  const queryClient = useQueryClient();

  // Query for fetching form types
  const {
    data: formTypeData,
    isPending: isLoadingFormTypes,
    error: formTypeError,
  } = useQuery({
    queryKey: ["formTypes"],
    queryFn: formTypeApi.getAll,
  });

  // Query for fetching form templates
  const {
    data: formTemplateData,
    isPending: isLoadingFormTemplates,
    error: formTemplateError,
  } = useQuery({
    queryKey: ["formTemplates"],
    queryFn: formTemplateApi.getAll,
  });

  // Email templates query
  const {
    data: emailTemplateData,
    isPending: isLoadingEmailTemplates,
    error: emailTemplateError,
  } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: emailTemplateApi.getAll,
  });

  // Show loading state if either query is loading
  if (isLoadingFormTypes || isLoadingFormTemplates || isLoadingEmailTemplates) {
    return <LoaderComponent />;
  }

  // Show any errors that occur
  if (formTypeError || formTemplateError || emailTemplateError) {
    return (
      <div>
        {formTypeError && (
          <div>Error fetching form types: {formTypeError.message}</div>
        )}
        {formTemplateError && (
          <div>Error fetching form templates: {formTemplateError.message}</div>
        )}
        {emailTemplateError && (
          <div>
            Error fetching email templates: {emailTemplateError.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        header="Questionnaire Setup"
        description="Create and manage questionnaire types, templates, and email content."
      />

      <div className="p-4 md:p-6">
        <Tabs defaultValue="form-types">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="form-types"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Form Types
            </TabsTrigger>
            <TabsTrigger
              value="form-templates"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Form Templates
            </TabsTrigger>
            <TabsTrigger
              value="email-content"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Email Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form-types" className="mt-0">
            {/* <FormTypesList /> */}
            <FormTypeTable
              columns={formTypeColumns}
              data={formTypeData || []}
            />
          </TabsContent>

          <TabsContent value="form-templates" className="mt-0">
            {/* <FormTemplatesList /> */}
            <FormTemplateTable
              columns={formTemplateColumns(formTypeData || [])}
              data={formTemplateData || []}
              formTypes={formTypeData || []}
            />
          </TabsContent>

          <TabsContent value="email-content" className="mt-0">
            <EmailTemplateTable
              columns={emailTemplateColumns}
              data={emailTemplateData || []}
              formTypes={formTypeData || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default QuestionnaireSetup;
