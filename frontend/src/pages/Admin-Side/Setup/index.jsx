import React from "react";
import AdminPageHeader from "@/components/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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
            {/* <FormTypesList /> */} FormType
          </TabsContent>

          <TabsContent value="form-templates" className="mt-0">
            {/* <FormTemplatesList /> */} FormTemplate
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
