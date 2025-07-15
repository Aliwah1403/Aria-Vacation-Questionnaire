import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Trash2Icon, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userTableDateLong } from "@/utils/dateFormat";

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
              {/* <User className="size-5 mx-auto" /> */}
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
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => {
      const ipAddress = row.getValue("ipAddress");
      return <div className="text-muted-foreground">{ipAddress}</div>;
    },
  },
  {
    accessorKey: "lastSignedIn",
    header: "Last Signed In",
    cell: ({ row }) => {
      const signedIn = row.getValue("lastSignedIn");
      return <div className="text-muted-foreground">{signedIn}</div>;
    },
  },
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
    cell: ({ row }) => {
      return (
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
            <DropdownMenuItem className="text-red-500">
              <Trash2Icon className="size-4 text-red-500" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
