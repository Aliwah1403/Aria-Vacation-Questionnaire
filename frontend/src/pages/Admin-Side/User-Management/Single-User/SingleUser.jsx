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
  Eye,
  EyeOff,
  UserCog,
  UserLock,
} from "lucide-react";
import { UAParser } from "ua-parser-js";
import { useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow, formatRelative } from "date-fns";
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
  DialogClose,
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
import { userDetailsApi } from "@/api/userDetails";
import { useQuery } from "@tanstack/react-query";
import { LoaderComponent } from "@/components/data-loader";

const SingleUser = () => {
  const id = useId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: userId } = useParams();

  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [revokeAllSessionsDialogOpen, setRevokeAllSessionsDialogOpen] =
    useState(false);
  const [revokeSessionDialogOpen, setRevokeSessionDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'delete' or 'ban' or 'unban
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(undefined);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Your password must contain 8 or more characters.");
    }
    return errors;
  };

  const validatePasswordForm = (password) => {
    const newPasswordErrors = validatePassword(passwordForm.newPassword);
    const confirmPasswordErrors = [];

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      confirmPasswordErrors.push("Passwords do not match");
    }

    return {
      newPasswordErrors,
      confirmPasswordErrors,
      isValid:
        newPasswordErrors.length === 0 && confirmPasswordErrors.length === 0,
    };
  };

  const [isLoading, setIsLoading] = useState(undefined);
  const [banForm, setBanForm] = useState({
    userId: "",
    reason: "",
    expirationDate: undefined,
  });

  const {
    data: userData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => userDetailsApi.getDetails(userId),
  });

  const { data: sessions, isPending: isUserSessionLoading } = useQuery({
    queryKey: ["userSessions", userId],
    queryFn: async () => {
      const data = await authClient.admin.listUserSessions({
        userId: userId,
      });
      // console.log("User Sessions Data: ", data);
      return data?.data?.sessions || [];
    },
  });

  const user = userData?.data;
  const userEmail = user?.email;
  const userName = user?.name;
  const userRole = user?.role;
  const firstName = user?.name.split(" ")[0];
  const lastName = user?.name.split(" ")[1];
  const initials = user?.name
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");
  const isBanned = user?.banned;
  const dateCreated = user?.createdAt;
  const dateUpdated = user?.updatedAt;

  // const [currentRole, setCurrentRole] = useState(userRole || "NNuance");
  const [pendingRole, setPendingRole] = useState("");

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
    if (newRole !== userRole) {
      setPendingRole(newRole);
      setShowRoleDialog(true);
    }
  };

  const confirmRoleChange = async () => {
    setIsChangingRole(`role-${userId}`);

    try {
      await authClient.admin.setRole({
        userId: userId,
        role: pendingRole,
      });
      toast.success(
        `${userName}'s role has been updated from ${userRole} to ${pendingRole}`
      );
      queryClient.invalidateQueries({ queryKey: ["userDetails", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Failed to update user role: ", error);
      toast.error(`Failed to update ${userName}'s role. Please try again.`);
    } finally {
      setIsChangingRole(undefined);
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordDialog(true);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors([]);
  };

  const handlePasswordFormChange = (field, value) => {
    const updatedForm = { ...passwordForm, [field]: value };
    setPasswordForm(updatedForm);

    // Validate in real-time
    if (field === "newPassword") {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const validation = validatePasswordForm();

    if (!validation.isValid) {
      setPasswordErrors([
        ...validation.newPasswordErrors,
        ...validation.confirmPasswordErrors,
      ]);
      return;
    }

    setIsChangingPassword(true);

    try {
      await authClient.admin.setUserPassword({
        userId: userId,
        newPassword: passwordForm.newPassword,
      });

      toast.success(`${userName}'s password has been updated successfully`);

      // Close dialog and reset form
      setShowPasswordDialog(false);
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors([]);
    } catch (error) {
      console.error("Failed to update user password: ", error);
      toast.error(`Failed to update ${userName}'s password. Please try again.`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRemoveSession = async (token) => {
    setIsLoading(`revoke-session-${userId}`);
    try {
      await authClient.admin.revokeUserSession({
        sessionToken: token,
      });
      queryClient.invalidateQueries({ queryKey: ["userSessions", userId] });
      toast.success(`Successfully revoked one session for ${userName}`);
    } catch (error) {
      console.log("Failed to revoke this session: ", error);
      toast.error("Failed to revoke this session. Please try again.");
    } finally {
      setIsLoading(undefined);
      setRevokeSessionDialogOpen(false);
    }
  };

  const handleRemoveAllSessions = async () => {
    setIsLoading(`revoke-sessions-${userId}`);
    try {
      await authClient.admin.revokeUserSessions({
        userId: userId,
      });
      queryClient.invalidateQueries({ queryKey: ["userSessions", userId] });
      toast.success(`Successfully revoked all sessions for ${userName}`);
    } catch (error) {
      console.error("Failed to revoke all sessions: ", error);
      toast.error("Failed to revoke all sessions. Please try again.");
    } finally {
      setIsLoading(undefined);
      setRevokeAllSessionsDialogOpen(false);
    }
  };

  if (isPending) {
    return <LoaderComponent />;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

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
              <BreadcrumbPage>{userName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AdminPageHeader
        header={userName}
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
                          {initials}
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
                          defaultValue={firstName}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          defaultValue={lastName}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">email</Label>
                      <Input
                        id="email"
                        defaultValue={userEmail}
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
                      <span className="font-medium">{userRole}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        User Role
                      </Label>

                      <RadioGroup
                        className="gap-3"
                        value={userRole}
                        onValueChange={handleRoleChange}
                        // disabled={isChangingRole !== `role-${userId}`}
                      >
                        {/* Radio card #1 */}
                        <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                          <RadioGroupItem
                            value="user"
                            id="user-role"
                            aria-describedby="user-role-description"
                            className="order-1 after:absolute after:inset-0 hover:cursor-pointer"
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
                            value="admin"
                            id="admin-role"
                            aria-describedby="admin-role-description"
                            className="order-1 after:absolute after:inset-0 hover:cursor-pointer"
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
                          <DropdownMenuItem onClick={handlePasswordChange}>
                            Change password
                          </DropdownMenuItem>
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
                      <Dialog
                        open={revokeAllSessionsDialogOpen}
                        onOpenChange={setRevokeAllSessionsDialogOpen}
                      >
                        <DialogTrigger>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            disabled={sessions?.length === 0}
                          >
                            Remove all devices
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Revoke Sessions</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to revoke these user
                              sessions?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <LoadingButton
                              type="submit"
                              variant="destructive"
                              onClick={handleRemoveAllSessions}
                              loading={
                                isLoading === `revoke-sessions-${userId}`
                              }
                              disabled={
                                isLoading === `revoke-sessions-${userId}`
                              }
                            >
                              Remove Devices
                            </LoadingButton>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {sessions?.map((session) => {
                      const parser = UAParser(session.userAgent);

                      const lastActive = formatRelative(
                        session.updatedAt,
                        new Date()
                      );

                      return (
                        <>
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <MonitorIcon className="size-5 text-gray-400" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {parser.device.model}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-700"
                                  >
                                    Active
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {parser.os.name} , {parser.browser.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <p className="text-xs text-gray-500">
                                {session.ipAddress || "N/A"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {lastActive}
                                </p>
                              </div>
                              <Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontalIcon className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem className="text-red-500">
                                        Remove device
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Revoke User Session
                                    </DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to revoke this user
                                      session?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <LoadingButton
                                      type="submit"
                                      variant="destructive"
                                      onClick={() =>
                                        handleRemoveSession(session.token)
                                      }
                                      loading={
                                        isLoading === `revoke-session-${userId}`
                                      }
                                      disabled={
                                        isLoading === `revoke-session-${userId}`
                                      }
                                    >
                                      Remove Device
                                    </LoadingButton>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </>
                      );
                    })}
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
                        <span className="text-sm font-mono">{userId}</span>
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
                        <span className="text-sm">{userEmail}</span>
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
                      <p className="text-sm mt-1">
                        {format(dateCreated, "PPP")}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Profile updated
                      </Label>
                      <p className="text-sm mt-1">
                        {formatDistanceToNow(dateUpdated, {
                          includeSeconds: true,
                        })}{" "}
                        ago
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Change User Role */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change Curtis Aliwah's role from{" "}
              <span className="font-medium">{userRole}</span> to{" "}
              <span className="font-medium">{pendingRole}</span>? This action
              will take effect immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isChangingRole === `role-${userId}`}
              onClick={() => {
                setShowRoleDialog(false);
                setPendingRole("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
              loading={isChangingRole === `role-${userId}`}
              disabled={isChangingRole === `role-${userId}`}
            >
              {isChangingRole === `role-${userId}`
                ? "Updating..."
                : "Confirm Change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change User Password */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Update {userName}'s password. They will need to use the new
                password for their next login.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      handlePasswordFormChange("newPassword", e.target.value)
                    }
                    placeholder="Enter new password"
                    required
                    className={
                      passwordErrors.length > 0 ? "border-red-300" : ""
                    }
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isChangingPassword}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      handlePasswordFormChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    required
                    className={
                      passwordForm.confirmPassword &&
                      passwordForm.newPassword !== passwordForm.confirmPassword
                        ? "border-red-300"
                        : ""
                    }
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isChangingPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>

                {/* Password mismatch error */}
                {passwordForm.confirmPassword &&
                  passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">
                        !
                      </span>
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Password validation errors */}
              {passwordErrors.length > 0 && (
                <div className="space-y-1">
                  {passwordErrors.map((error, index) => (
                    <p
                      key={index}
                      className="text-sm text-red-600 flex items-center"
                    >
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">
                        !
                      </span>
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {isChangingPassword && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-fountain-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Updating password...
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                loading={isChangingPassword}
                disabled={
                  isChangingPassword ||
                  passwordErrors.length > 0 ||
                  passwordForm.newPassword !== passwordForm.confirmPassword ||
                  passwordForm.newPassword.length === 0
                }
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SingleUser;
