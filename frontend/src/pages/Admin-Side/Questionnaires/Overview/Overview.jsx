import { useState } from "react";

import {
  ChevronDown,
  ClipboardList,
  Mail,
  Search,
  Settings,
  Users,
} from "lucide-react";
// import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPageHeader from "@/components/admin-page-header";
import { QuestionnairesOverviewTable } from "./questionnaires-overview-table";
import { overviewColumns } from "./columns";
import { DashboardDatePicker } from "@/components/dashboard-date-picker";
import { data } from "./dummyData";
import MultiStepQuestionnaireForm from "../../Member-Details/multi-step-questionnaire-form";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionApi } from "@/api/formSubmissions";
import { formTemplateApi } from "@/api/formTemplates";
import { formTypeApi } from "@/api/formTypes";
import { LoaderComponent } from "@/components/data-loader";

const QuestionnairesOverview = () => {
  const [stayDetailsDialog, setStayDetailsDialog] = useState(false);
  const [selectedFormCode, setSelectedFormCode] = useState(null);

  const { data: formTypeData } = useQuery({
    queryKey: ["formTypes"],
    queryFn: formTypeApi.getAll,
  });

  const { data: formTemplateData } = useQuery({
    queryKey: ["formTemplates"],
    queryFn: formTemplateApi.getAll,
  });

  const {
    data: formSubmissionData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["formSubmissions", selectedFormCode],
    queryFn: () =>
      formSubmissionApi.getAll({
        formCode: selectedFormCode,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
      {/* Project Header */}
      <AdminPageHeader
        header="Aria Vacation Club Feedback Surveys"
        description="  Manage and send questionnaires to gather feedback about members'
              resort experience."
        action={
          <>
            {/* <DashboardDatePicker /> */}
            <Button variant="outline">Export</Button>

            {/* Stay Details Dialog */}
            <Dialog
              open={stayDetailsDialog}
              onOpenChange={setStayDetailsDialog}
            >
              <DialogTrigger asChild>
                <Button
                  className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                  // onClick={() => setStayDetailsDialog(true)}
                >
                  Send Questionnaires
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-[700px]"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Send Questionnaire
                  </DialogTitle>
                </DialogHeader>
                {/* <StayDetailsForm setStayDetailsDialog={setStayDetailsDialog} /> */}
                <MultiStepQuestionnaireForm
                  setStayDetailsDialog={setStayDetailsDialog}
                  formTypes={formTypeData}
                  formTemplates={formTemplateData}
                />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/* Content Area */}
      <div className="p-4 md:p-6">
        <Tabs
          value={selectedFormCode}
          onValueChange={setSelectedFormCode}
          defaultValue={null}
        >
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value={null}
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            {formTypeData?.map((formType) => (
              <TabsTrigger
                key={formType._id}
                value={formType.formCode}
                className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {formType.formName}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedFormCode} className="mt-0">
            {isPending ? (
              <LoaderComponent />
            ) : (
              <QuestionnairesOverviewTable
                columns={overviewColumns}
                data={formSubmissionData || []}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default QuestionnairesOverview;
