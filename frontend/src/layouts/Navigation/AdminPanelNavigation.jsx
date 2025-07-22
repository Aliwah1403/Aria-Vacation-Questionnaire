"use client";

import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";

import { User, LogOut, UserCog, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AriaLogo from "@/assets/AriaLogo.png";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const IMPERSONATION_DURATION_MS = 60 * 60 * 1000; // 1 hour in ms

const AdminPanelNavigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: false,
    isWarning: false,
    isCritical: false,
  });
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [hasShownCritical, setHasShownCritical] = useState(false);

  const { data: session } = useSession();

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
            navigate("admin/login");
          },
        },
      });
    } catch (error) {
      setIsSigningOut(false);
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  };

  const handleEndImpersonation = async () => {
    setIsSigningOut(true);
    try {
      await authClient.admin.stopImpersonating();
      setIsSigningOut(false);
      toast.info("Impersonation stopped successfully");
      navigate("/admin/users");
      navigate(0);
    } catch (error) {
      setIsSigningOut(false);
      toast.error("Failed to end impersonation. Please try again.");
      console.error("End impersonation error:", error);
    }
  };

  useEffect(() => {
    // Only run timer if impersonating
    if (!session?.session?.impersonatedBy || !session?.session?.createdAt)
      return;

    const impersonationStart = new Date(session.session.createdAt).getTime();
    const impersonationExpiration =
      impersonationStart + IMPERSONATION_DURATION_MS;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = impersonationExpiration - now;

      if (difference <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isExpired: true,
          isWarning: false,
          isCritical: false,
        });
        if (!isSigningOut) {
          toast.error("Impersonation session has expired");
          handleEndImpersonation();
        }
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const isWarning = totalSeconds <= 600 && totalSeconds > 300;
      const isCritical = totalSeconds <= 300;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        totalSeconds,
        isExpired: false,
        isWarning,
        isCritical,
      });

      if (isWarning && !hasShownWarning && !isCritical) {
        setHasShownWarning(true);
        toast.warning("Impersonation session will expire in 10 minutes", {
          duration: 5000,
        });
      }
      if (isCritical && !hasShownCritical) {
        setHasShownCritical(true);
        toast.error("Impersonation session will expire in 5 minutes!", {
          duration: 8000,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [
    session?.session?.impersonatedBy,
    session?.session?.createdAt,
    hasShownWarning,
    hasShownCritical,
    isSigningOut,
  ]);

  const getTimerColor = () => {
    if (timeLeft.isCritical) return "text-red-100 bg-red-500/20";
    if (timeLeft.isWarning) return "text-yellow-100 bg-yellow-500/20";
    return "text-white bg-white/15";
  };

  const getBannerColor = () => {
    if (timeLeft.isCritical) return "bg-red-500";
    if (timeLeft.isWarning) return "bg-yellow-500";
    return "bg-fountain-blue-400";
  };

  const formatTime = (value) => value.toString().padStart(2, "0");

  return (
    <>
      {isSigningOut && (
        <SignOutOverlayLoader message="Hang on tight while we sign you out of your account..." />
      )}

      {/* User Impersonation Banner */}
      {session?.session.impersonatedBy && (
        <div
          className={`${getBannerColor()}  text-white px-4 py-3 md:py-2 transition-colors duration-300`}
        >
          <div className="flex gap-2 md:items-center">
            <div className="flex grow gap-3 md:items-center">
              <div className="flex items-center gap-2 shrink-0">
                <UserCog
                  className="opacity-60 max-md:mt-0.5"
                  size={16}
                  aria-hidden="true"
                />
                {timeLeft.isCritical && (
                  <AlertTriangle
                    className="animate-pulse text-red-200"
                    size={16}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm font-medium">
                  You are currently impersonating {user?.name}
                </p>

                {/* Enhanced Session Timer */}
                <div className="flex flex-row gap-2 items-center">
                  <Clock size={14} className="opacity-75" />
                  <span className="text-sm font-medium">
                    Session expires in:
                  </span>
                  <div
                    className={`${getTimerColor()} flex items-center divide-x divide-white/20 rounded-lg text-sm font-mono font-semibold shadow-sm border border-white/20`}
                  >
                    {timeLeft.hours > 0 && (
                      <div className="flex flex-col items-center px-3 py-2">
                        <span className="text-lg leading-none">
                          {formatTime(timeLeft.hours)}
                        </span>
                        <span className="text-xs opacity-75 mt-0.5">hrs</span>
                      </div>
                    )}
                    <div className="flex flex-row gap-1 items-center px-3 py-2">
                      <span className="text-lg leading-none">
                        {formatTime(timeLeft.minutes)}
                      </span>
                      <span className="text-xs opacity-75 mt-0.5">min</span>
                    </div>
                    <div className="flex flex-row gap-1 items-center px-3 py-2">
                      <span className="text-lg leading-none">
                        {formatTime(timeLeft.seconds)}
                      </span>
                      <span className="text-xs opacity-75 mt-0.5">sec</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 max-md:flex-wrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    className={`text-sm font-medium ${
                      timeLeft.isCritical
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : timeLeft.isWarning
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                    onClick={handleEndImpersonation}
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? "Ending..." : "End Session"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 bg-background px-4 md:px-6">
        <div className="flex items-center gap-10">
          <img
            src={AriaLogo || "/placeholder.svg"}
            className="mx-auto"
            width={100}
            height={50}
          />
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
                <AvatarFallback className="rounded-full bg-fountain-blue-500 text-white">
                  {initials}
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
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-full ">
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
      <Separator />
    </>
  );
};

export default AdminPanelNavigation;
