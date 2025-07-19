import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  EllipsisIcon,
  Trash2Icon,
  User2Icon,
  UserCog,
  UserLock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userTableDateLong } from "@/utils/dateFormat";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const UserManagementActions = ({ row }) => {
  const queryClient = useQueryClient();

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

  const user = row.original;
  const userId = user.id;
  const userEmail = user.email;
  const userName = user.name;
  const isBanned = user.banned;

  console.log("User status: ", isBanned);

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <EllipsisIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="middle">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User2Icon className="size-4" />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem>
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
              <span className="text-foreground-muted">{userEmail}</span>) from
              accessing the Feedback Panel
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
              <span className="font-semibold">{user.name}</span> ({user.email})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setDialogType(null)}>
              Delete
            </Button>
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
              <span className="font-semibold">{user.name}</span> ({user.email})?
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
  );
};

export const usersColumns = [
  //   {
  //     accessorKey: "name",
  //     header: "Name",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //   },
  {
    accessorKey: "User",
    header: "User",
    cell: ({ row }) => {
      const { name, email } = row.original;
      const initials = name
        .split(" ")
        .map((part) => part[0].toUpperCase())
        .join("");

      return (
        <div className="flex items-cennter gap-3">
          <Avatar className="size-10 rounded-full ">
            {/* <AvatarImage src={avatar} alt="UserProfile" /> */}
            <AvatarFallback className="rounded-full bg-fountain-blue-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <span className="text-muted-foreground mt-0.5 text-xs">
              {email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      return <span className="capitalize">{role}</span>;
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("banned");
      return (
        <div>
          {status ? (
            <Badge variant="outline" className="gap-1.5">
              <span
                className="size-1.5 rounded-full bg-red-500"
                aria-hidden="true"
              ></span>
              Banned
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              ></span>
              Active
            </Badge>
          )}
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "ipAddress",
  //     header: "IP Address",
  //     cell: ({ row }) => {
  //       const ipAddress = row.getValue("ipAddress");
  //       return <div className="text-muted-foreground">{ipAddress}</div>;
  //     },
  //   },
  //   {
  //     accessorKey: "lastSignedIn",
  //     header: "Last Signed In",
  //     cell: ({ row }) => {
  //       const signedIn = row.getValue("lastSignedIn");
  //       return <div className="text-muted-foreground">{signedIn}</div>;
  //     },
  //   },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const created = row.getValue("createdAt");
      return (
        <div className="text-muted-foreground">
          {userTableDateLong(created)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserManagementActions row={row} />,
  },
];
