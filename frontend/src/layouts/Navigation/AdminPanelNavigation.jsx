import React from "react";
import { NavLink, useNavigate } from "react-router";

import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import AriaLogo from "@/assets/AriaLogo.png";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@//lib/auth-client";

const AdminPanelNavigation = () => {
  const { data: session } = useSession();

  const user = session?.user;

  const initials = user?.name
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate("admin/login"); // redirect to login page
          },
        },
      });
      // Redirect to the login page or perform any other action after sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 bg-background px-4 md:px-6">
        <div className="flex items-center gap-10">
          <img src={AriaLogo} className="mx-auto" width={100} height={50} />
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary/80"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/questionnaires"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary/80"
                    }`
                  }
                >
                  Questionnaires
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/questionnaire-setup"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary/80"
                    }`
                  }
                >
                  Setup
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="hover:cursor-pointer hover:bg-accent"
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-10 rounded-full ">
                {/* <AvatarImage src={avatar} alt="UserProfile" /> */}
                <AvatarFallback className="rounded-full">
                  {initials}
                  {/* <User className="size-5 mx-auto" /> */}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium capitalize">
                  {user?.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            // side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-full ">
                  {/* <AvatarImage src={avatar} alt="UserProfile" /> */}
                  <AvatarFallback className="rounded-full ">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleSignOut}>
              <LogOut className="stroke-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Separator />
    </>
  );
};

export default AdminPanelNavigation;
