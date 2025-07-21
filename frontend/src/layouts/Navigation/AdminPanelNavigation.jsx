import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";

import { User, LogOut, Eclipse, UserCog } from "lucide-react";
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
import { toast } from "sonner";
import AccountSettingsDialog from "@/pages/Admin-Side/Auth/User-Settings/account-settings-dialog";
import SignOutOverlayLoader from "@/components/signout-overlay-loader";
import { authClient } from "@/lib/auth-client";

const AdminPanelNavigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session } = useSession();

  console.log("Current Session: ", session);

  const user = session?.user;

  const initials = user?.name
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");

  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsSigningOut(false);
            navigate("admin/login"); // redirect to login page
          },
        },
      });
    } catch (error) {
      setIsSigningOut(false);
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      {isSigningOut && (
        <SignOutOverlayLoader message="Hang on tight while we sign you out of your account..." />
      )}
      {/* User Impersonation Banner */}
      {session?.session.impersonatedBy && (
        <div className=" bg-fountain-blue-400 text-white px-4 py-3 md:py-2">
          <div className="flex gap-2 md:items-center">
            <div className="flex grow gap-3 md:items-center">
              <UserCog
                className="shrink-0 opacity-60 max-md:mt-0.5"
                size={16}
                aria-hidden="true"
              />
              <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm">
                  You are currently impersonating {user?.name}
                </p>
                <div className="flex gap-2 max-md:flex-wrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-sm"
                    onClick={async () => {
                      setIsSigningOut(true);
                      await authClient.admin.stopImpersonating();
                      setIsSigningOut(false);
                      toast.info("Impersonation stopped successfully");
                      navigate("/admin/users");
                      navigate(0);
                    }}
                    disabled={isSigningOut}
                  >
                    End Session
                  </Button>
                  <Button variant="link" size="sm" className="text-sm">
                    Learn more
                  </Button>
                </div>
              </div>
            </div>
            {/* <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            // onClick={() => setIsVisible(false)}
            aria-label="Close banner"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button> */}
          </div>
        </div>
      )}
      {/* Panel Header */}
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
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary/80"
                    }`
                  }
                >
                  Users
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
                <AvatarFallback className="rounded-full bg-fountain-blue-500 text-white">
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
                  <AvatarFallback className="rounded-full bg-fountain-blue-500 text-white">
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
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
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
        <AccountSettingsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </header>
      <Separator />{" "}
    </>
  );
};

export default AdminPanelNavigation;
