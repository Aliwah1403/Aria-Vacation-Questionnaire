import AdminPageHeader from "@/components/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoveLeftIcon,
  MoreHorizontalIcon,
  PlusIcon,
  CopyIcon,
  MonitorIcon,
} from "lucide-react";
import { Link } from "react-router";

const SingleUser = () => {
  return (
    <>
      <AdminPageHeader
        header="Curtis Aliwah"
        description="Last active yesterday"
        action={
          <Link to={"/admin/users"}>
            <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
              <MoveLeftIcon />
              Back to users
            </Button>
          </Link>
        }
      />

      <div className="p-4 md:p-6">
        <Tabs>
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-6">
                      Personal Information
                    </h3>

                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          CA
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          Add avatar
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommend size 1:1, up to 2mb
                        </p>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          defaultValue="Curtis"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          defaultValue="Aliwah"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Addresses */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Email addresses
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-sm">
                            aliwahcurtis5@gmail.com
                          </span>
                          <div className="flex gap-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-700"
                            >
                              Primary
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Linked
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            added Aug 18, 2024
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-blue-600"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add email
                    </Button>
                  </CardContent>
                </Card>

                {/* Social Accounts */}
                {/* <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Social accounts
                    </h3>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                          G
                        </div>
                        <span className="text-sm font-medium">Google</span>
                        <span className="text-sm text-gray-500">
                          • aliwahcurtis5@gmail.com
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          added Jul 19, 2025
                        </span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}

                {/* Password */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Password</h3>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm">••••••••••</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontalIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Devices */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Devices</h3>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MonitorIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Macintosh
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-700"
                            >
                              Active
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">Firefox 140.0</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            5.32.107.38 (Al Sajaah, AE)
                          </p>
                          <p className="text-xs text-gray-500">
                            Today at 8:41 AM
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - User Details */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        User ID
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-mono">
                          user_2knq-qMJXNvAMZ
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <CopyIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Primary email
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">aliwahcurtis5@gmail.com</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <CopyIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        User since
                      </Label>
                      <p className="text-sm mt-1">August 18, 2024</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Profile updated
                      </Label>
                      <p className="text-sm mt-1">3d ago</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SingleUser;
