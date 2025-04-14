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

const QuestionnairesOverview = () => {
  const [stayDetailsDialog, setStayDetailsDialog] = useState(false);
  const [selectedFormCode, setSelectedFormCode] = useState(null);

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
        header="Stay Experience Survey"
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
              <DialogContent className="max-w-[700px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Send Questionnaire
                  </DialogTitle>
                </DialogHeader>
                {/* <StayDetailsForm setStayDetailsDialog={setStayDetailsDialog} /> */}
                <MultiStepQuestionnaireForm
                  setStayDetailsDialog={setStayDetailsDialog}
                  formTemplates={formTemplateData}
                />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/* Content Area */}
      <div className="p-4 md:p-6">
        {/* <Tabs defaultValue="overview">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="stay-experience"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Stay Experience
            </TabsTrigger>
            <TabsTrigger
              value="amenities"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Amenities
            </TabsTrigger>
            <TabsTrigger
              value="customer-service"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Customer Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <QuestionnairesOverviewTable
              columns={overviewColumns}
              data={formSubmissionData || []}
            />
          </TabsContent>
          <TabsContent value="stay-experience">
            <p className="text-muted-foreground p-4 text-center text-xs">
              Stay Experience Questionnaire Data Table
            </p>
          </TabsContent>
          <TabsContent value="amenities">
            <p className="text-muted-foreground p-4 text-center text-xs">
              Amenities Questionnaire Data Table
            </p>
          </TabsContent>
          <TabsContent value="customer-service">
            <p className="text-muted-foreground p-4 text-center text-xs">
              Customer Service Questionnaire Data Table
            </p>
          </TabsContent>
        </Tabs> */}

        <Tabs
          value={selectedFormCode} // Controlled value
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
            <TabsTrigger
              value="stay-experience-survey"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Stay Experience Experience
            </TabsTrigger>
            <TabsTrigger
              value="testing-survey"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Testing Survey Experience
            </TabsTrigger>
            <TabsTrigger
              value="test-filter"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Filter Experience
            </TabsTrigger>
            <TabsTrigger
              value="form-submission-survey"
              className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Form Submission Survey
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedFormCode} className="mt-0">
            {isPending ? (
              <div>Loading...</div>
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
