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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPageHeader from "@/components/admin-page-header";
import { RecentResponsesTable } from "./admin-panel-table";
import { columns } from "./columns";
import { DashboardDatePicker } from "@/components/dashboard-date-picker";
const data = [
  {
    id: "1",
    memberName: "John Smith",
    stayDate: "2024-02-25",
    submittedAt: "2024-03-01",
    rating: 5,
    status: "completed",
  },
  {
    id: "2",
    memberName: "Sarah Johnson",
    stayDate: "2024-02-24",
    submittedAt: "2024-02-28",
    rating: 4,
    status: "completed",
  },
  {
    id: "3",
    memberName: "Michael Chen",
    stayDate: "2024-02-23",
    submittedAt: "2024-02-27",
    rating: 5,
    status: "completed",
  },
  {
    id: "4",
    memberName: "Emma Wilson",
    stayDate: "2024-02-22",
    submittedAt: "2024-02-26",
    rating: 3,
    status: "completed",
  },
  {
    id: "5",
    memberName: "James Rodriguez",
    stayDate: "2024-02-21",
    submittedAt: "2024-02-25",
    rating: 4,
    status: "completed",
  },
  {
    id: "6",
    memberName: "Maria Garcia",
    stayDate: "2024-02-20",
    submittedAt: "2024-02-24",
    rating: 5,
    status: "completed",
  },
  {
    id: "7",
    memberName: "David Kim",
    stayDate: "2024-02-19",
    submittedAt: "2024-02-23",
    rating: 4,
    status: "completed",
  },
  {
    id: "8",
    memberName: "Lisa Brown",
    stayDate: "2024-02-18",
    submittedAt: "2024-02-22",
    rating: 5,
    status: "completed",
  },
  {
    id: "9",
    memberName: "Robert Taylor",
    stayDate: "2024-02-17",
    submittedAt: "2024-02-21",
    rating: 2,
    status: "completed",
  },
  {
    id: "10",
    memberName: "Amanda Martinez",
    stayDate: "2024-02-16",
    submittedAt: "2024-02-20",
    rating: 4,
    status: "completed",
  },
  {
    id: "11",
    memberName: "Thomas Anderson",
    stayDate: "2024-02-15",
    submittedAt: "2024-02-19",
    rating: 5,
    status: "completed",
  },
  {
    id: "12",
    memberName: "Sophie Williams",
    stayDate: "2024-02-14",
    submittedAt: "2024-02-18",
    rating: 3,
    status: "completed",
  },
];
export default function AdminDashboard() {
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
            <DashboardDatePicker />
            {/* <Button variant="outline">Preview Form</Button>
            <Button variant="outline">Edit Template</Button>
            <Button>Send to Members</Button> */}
          </>
        }
      />

      {/* Content Area */}
      <div className="p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-4">
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
        </Tabs>
      </div>
    </>
  );
}
