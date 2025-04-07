import React from "react";
import AdminPageHeader from "@/components/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormTypeTable } from "./formType/form-type-table";
import { formTypeColumns } from "./formType/columns";
import { formTemplateColumns } from "./formTemplate/columns";
import { FormTemplateTable } from "./formTemplate/form-template-table";

const formTypes = [
  // convert boolean values to strings when connecting DB
  {
    id: 1,
    formName: "Stay Experience Survey",
    formDescription: "Gather feedback about members' resort experience",
    isActive: true,
  },
  {
    id: 2,
    formName: "Amenities Feedback",
    formDescription: "Collect feedback on resort amenities",
    isActive: true,
  },
  {
    id: 3,
    formName: "Customer Service Rating",
    formDescription: "Rate the quality of customer service",
    isActive: true,
  },
  {
    id: 4,
    formName: "Post-Stay Survey",
    formDescription: "Follow-up survey after member checkout",
    isActive: false,
  },
];

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

const QuestionnaireSetup = () => {
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
            <FormTypeTable columns={formTypeColumns} data={formTypes} />
          </TabsContent>

          <TabsContent value="form-templates" className="mt-0">
            {/* <FormTemplatesList /> */}
            <FormTemplateTable
              columns={formTemplateColumns}
              data={formTemplates}
            />
          </TabsContent>

          <TabsContent value="email-content" className="mt-0">
            {/* <EmailContentList />  */} EmailContent
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default QuestionnaireSetup;
