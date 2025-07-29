import { useState, useId } from "react";
import AdminPageHeader from "@/components/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  MoveLeftIcon,
  MoreHorizontalIcon,
  PlusIcon,
  CopyIcon,
  MonitorIcon,
  ChevronDownIcon,
  Lock,
  CalendarIcon,
  EllipsisIcon,
  Trash2Icon,
  User2Icon,
  UserCog,
  UserLock,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, useParams } from "react-router";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingButton } from "@/components/ui/loading-button";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const SingleUser = () => {
  const id = useId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: userId } = useParams();

  const [currentRole, setCurrentRole] = useState("User");
  const [pendingRole, setPendingRole] = useState("");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'delete' or 'ban' or 'unban
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(undefined);
  const [banForm, setBanForm] = useState({
    userId: "",
    reason: "",
    expirationDate: undefined,
  });

  const user = userId;
  const userEmail = user.email;
  const userName = user.name;
  const isBanned = user.banned;



  const handleBanUser = async (e) => {
    e.preventDefault();
    setIsLoading(`ban-${banForm.userId}`);
    try {
      await authClient.admin.banUser({
        userId: userId,
        banReason: banForm.reason,
        banExpiresIn: banForm.expirationDate.getTime() - new Date().getTime(),
      });

      toast.success(`${userName} banned successfully`);

      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Failed to ban the user: ", error);
      toast.error(`Failed to ban ${userName}. Please try again`);
    } finally {
      setIsLoading(undefined);
      setDialogType(null);
    }
  };

  const handleUnbanUser = async () => {
    setIsLoading(`unban-${userId}`);
    try {
      await authClient.admin.unbanUser({
        userId: userId,
      });
      toast.success(
        `${userName} unbanned successfully. They can now log into their account`
      );

      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error(`Failed to unban ${userName}: `, error);
      toast.error(`Failed to unban ${userName}. Please try again`);
    } finally {
      setIsLoading(undefined);
      setDialogType(null);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(`delete-${userId}`);
    try {
      await authClient.admin.removeUser({
        userId: userId,
      });
      toast.success(`${userName}'s account deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Failed to delete user: ", error);
      toast.error(
        `There was a problem deleting ${userName}'s account. Please try again.`
      );
    } finally {
      setIsLoading(undefined);
      setDialogType(null);
    }
  };

  const handleImpersonateUser = async () => {
    setIsLoading(`impersonate-${userId}`);

    try {
      const impersonatedUser = authClient.admin.impersonateUser({
        userId: userId,
      });
      toast.promise(impersonatedUser, {
        loading: "Impersonating User...",
        success: `Impersonated ${userName}. You will be redirected to dashboard shortly`,
        error: `There was a problem tying to impersonate ${userName}. Please try again.`,
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
        navigate(0);
      }, 3000);
    } catch (error) {
      console.error(`Failed to impersonate ${userName}: `, error);
    }
  };

  const handleRoleChange = (newRole) => {
    setPendingRole(newRole);
    setShowRoleDialog(true);
  };

  const confirmRoleChange = () => {
    setCurrentRole(pendingRole);
    setShowRoleDialog(false);
    // Here you would typically make an API call to update the role
    console.log(`Role changed to: ${pendingRole}`);
  };

  const handleRemoveAllSessions = () => {
    // Here you would typically make an API call to remove all sessions
    console.log("Removing all sessions...");
  };

  return (
    <>
      <div className="bg-background px-4 md:px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Curtis Aliwah</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AdminPageHeader
        header="Curtis Aliwah"
        description="Last active yesterday"
        action={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
                  Actions
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleImpersonateUser()}>
                  <UserCog className="size-4" />
                  Impersonate user
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {isBanned ? (
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => {
                      setDialogType("unban");
                      setIsBanDialogOpen(true);
                    }}
                  >
                    <UserLock className="size-4 text-red-500" />
                    Unban user
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => {
                      setDialogType("ban");
                      setIsBanDialogOpen(true);
                    }}
                  >
                    <UserLock className="size-4 text-red-500" />
                    Ban user
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    setDialogType("delete");
                  }}
                >
                  <Trash2Icon className="size-4 text-red-500" />
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={dialogType === "ban"}
              onOpenChange={() => setDialogType(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ban User</DialogTitle>
                  <DialogDescription>
                    {" "}
                    You are about to ban {userName}(
                    <span className="text-foreground-muted">{userEmail}</span>)
                    from accessing the Feedback Panel
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBanUser} className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      id="reason"
                      value={banForm.reason}
                      onChange={(e) =>
                        setBanForm({ ...banForm, reason: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="expirationDate">Ban Expiration Date</Label>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          id="expirationDate"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !banForm.expirationDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {banForm.expirationDate ? (
                            format(banForm.expirationDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={banForm.expirationDate}
                          onSelect={(date) =>
                            setBanForm({ ...banForm, expirationDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <LoadingButton
                    type="submit"
                    className="w-full bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                    loading={isLoading === `ban-${banForm.userId}`}
                    disabled={isLoading === `ban-${banForm.userId}`}
                  >
                    {isLoading === `ban-${banForm.userId}`
                      ? "  Processing...."
                      : "Ban User"}
                  </LoadingButton>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog
              open={dialogType === "delete"}
              onOpenChange={() => setDialogType(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold">{user.name}</span> (
                    {user.email})? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setDialogType(null)}>
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="destructive"
                    loading={isLoading === `delete-${userId}`}
                    disabled={isLoading === `delete-${userId}`}
                    onClick={() => handleDeleteUser()}
                  >
                    {isLoading === `delete-${userId}`
                      ? "  Deleting...."
                      : "Delete User"}
                  </LoadingButton>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={dialogType === "unban"}
              onOpenChange={() => setDialogType(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unban User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to unban{" "}
                    <span className="font-semibold">{user.name}</span> (
                    {user.email})?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setDialogType(null)}>
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    className="w-auto bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                    loading={isLoading === `unban-${userId}`}
                    disabled={isLoading === `unban-${userId}`}
                    onClick={() => handleUnbanUser()}
                  >
                    {isLoading === `unban-${userId}`
                      ? "  Processing...."
                      : "Unban User"}
                  </LoadingButton>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
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
                      <Avatar className="size-15">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-fountain-blue-500 text-white">
                          CA
                        </AvatarFallback>
                      </Avatar>
                      {/* <div>
                        <Button variant="outline" size="sm">
                          Add avatar
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommend size 1:1, up to 2mb
                        </p>
                      </div> */}
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
                    <div>
                      <Label htmlFor="email">email</Label>
                      <Input
                        id="email"
                        defaultValue="curtis.aliwah@ariavacationnclub.com"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                      disabled
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                {/* Role Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Role Management</CardTitle>
                    <CardDescription>
                      Current role:{" "}
                      <span className="font-medium">{currentRole}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        User Role
                      </Label>

                      <RadioGroup
                        className="gap-3"
                        value={currentRole}
                        onValueChange={handleRoleChange}
                      >
                        {/* Radio card #1 */}
                        <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                          <RadioGroupItem
                            value="User"
                            id="user-role"
                            aria-describedby="user-role-description"
                            className="order-1 after:absolute after:inset-0"
                          />
                          <div className="grid grow gap-2">
                            <Label htmlFor="user-role">
                              User{" "}
                              {/* <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                                (Sublabel)
                              </span> */}
                            </Label>
                            <p
                              id="user-role-description"
                              className="text-muted-foreground text-xs"
                            >
                              Standard account with access to basic platform
                              features. Can manage their own profile, access
                              content, and use core functionality. Cannot access
                              admin controls or modify system setups.
                            </p>
                          </div>
                        </div>
                        {/* Radio card #2 */}
                        <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                          <RadioGroupItem
                            value="Admin"
                            id="admin-role"
                            aria-describedby="admin-role-description"
                            className="order-1 after:absolute after:inset-0"
                          />
                          <div className="grid grow gap-2">
                            <Label htmlFor="admin-role">Admin </Label>
                            <p
                              id="admin-role-description"
                              className="text-muted-foreground text-xs"
                            >
                              Full administrative privileges with complete
                              system access. Can manage all users, modify setups
                              and perform maintenance tasks. Use caution when
                              assigning this role.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                {/* Password */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Password</h3>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {/* <div className="w-2 h-2 bg-gray-300 rounded-full"></div> */}
                        <Lock className="size-4 text-gray-400" />
                        <span className="text-sm">••••••••••</span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change password</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>

                {/* Devices */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Devices</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAllSessions}
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      >
                        Remove all devices
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MonitorIcon className="size-5 text-gray-400" />
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
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500">
                          5.32.107.38 (Al Sajaah, AE)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Today at 8:41 AM
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontalIcon className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-500">
                              Remove device
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                          {userId}
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
                        <span className="text-sm">
                          curtis.aliwah@ariavacationclub.com
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

      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change Curtis Aliwah's role from{" "}
              <span className="font-medium">{currentRole}</span> to{" "}
              <span className="font-medium">{pendingRole}</span>? This action
              will take effect immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
            >
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SingleUser;
