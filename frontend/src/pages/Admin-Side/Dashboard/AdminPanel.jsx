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
import { ResponsesTable } from "./admin-panel-table";
import { columns } from "./columns";
import { DashboardDatePicker } from "@/components/dashboard-date-picker";
import { data } from "./dummyData";
import StayDetailsForm from "../Member-Details/stay-details-form";
import MultiStepQuestionnaireForm from "../Member-Details/multi-step-questionnaire-form";

export default function AdminDashboard() {
  const [stayDetailsDialog, setStayDetailsDialog] = useState(false);
  return (
    <>
      {/* <div className="border-b bg-background px-4 py-4 md:px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Questionnaires</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Stay Experience Survey</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div> */}

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
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Send Questionnaire
                  </DialogTitle>
                </DialogHeader>
                {/* <StayDetailsForm setStayDetailsDialog={setStayDetailsDialog} /> */}
                <MultiStepQuestionnaireForm
                  setStayDetailsDialog={setStayDetailsDialog}
                />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/* Content Area */}
      <div className="p-4 md:p-6">
        {/* <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Responses
                  </CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">
                    +20% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Response Rate
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">75%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Responses
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82</div>
                  <p className="text-xs text-muted-foreground">
                    Sent in last 7 days
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Rating
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <p className="text-xs text-muted-foreground">
                    Based on latest responses
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Responses</CardTitle>
                <CardDescription>
                  Latest feedback received from resort members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentResponsesTable columns={columns} data={data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs> */}

        {/* Single Page Approach */}
        <ResponsesTable columns={columns} data={data} />
      </div>

      {/* <ResponsesTable columns={columns} data={data} /> */}
    </>
  );
}
