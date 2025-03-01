import {
  ChevronDown,
  ClipboardList,
  Mail,
  Search,
  Settings,
  Users,
} from "lucide-react";
// import Image from "next/image";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-primary text-primary-foreground">
            <ClipboardList className="h-4 w-4" />
          </div>
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              <li className="text-sm font-medium">
                <Link href="#" className="font-semibold">
                  Dashboard
                </Link>
              </li>
              <li className="text-sm font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  Questionnaires
                  <Badge variant="secondary" className="ml-1 rounded-full">
                    New
                  </Badge>
                </Link>
              </li>
              <li className="text-sm font-medium">
                <Link href="#" className="text-muted-foreground">
                  Members
                </Link>
              </li>
              <li className="text-sm font-medium">
                <Link href="#" className="text-muted-foreground">
                  Responses
                </Link>
              </li>
              <li className="text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="flex items-center gap-1 p-0 text-muted-foreground"
                    >
                      Settings
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Management</DropdownMenuLabel>
                    <DropdownMenuItem>Email Templates</DropdownMenuItem>
                    <DropdownMenuItem>Form Templates</DropdownMenuItem>
                    <DropdownMenuItem>Automation Rules</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Resort Settings</DropdownMenuItem>
                    <DropdownMenuItem>User Preferences</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search members</span>
          </Button>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full border object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-background px-4 py-4 md:px-6">
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
        </div>

        {/* Project Header */}
        <div className="bg-background px-4 py-6 md:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Stay Experience Survey
              </h1>
              <p className="text-muted-foreground">
                Manage and send questionnaires to gather feedback about members'
                resort experience.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Preview Form</Button>
              <Button variant="outline">Edit Template</Button>
              <Button>Send to Members</Button>
            </div>
          </div>
        </div>

        <Separator />

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
                  <p className="text-sm text-muted-foreground">
                    Response data will appear here...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
