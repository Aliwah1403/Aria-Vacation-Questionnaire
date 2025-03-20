import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AriaLogo from "@/assets/AriaLogo.png";
import { Separator } from "@/components/ui/separator";

const AdminPanelNavigation = () => {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4  bg-background px-4 md:px-6">
        <div className="flex items-center gap-10">
          <img src={AriaLogo} className="mx-auto" width={100} height={50} />
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-primary text-primary-foreground">
          <ClipboardList className="h-4 w-4" />
        </div> */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              <li className="text-sm font-medium">
                <Link to={"/admin/dashboard"}>Dashboard</Link>
              </li>
              <li className="text-sm font-medium">
                <Link
                  to={"/admin/questionnaires"}
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  Questionnaires
                </Link>
              </li>
              {/* <li className="text-sm font-medium">
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
              </li> */}
            </ul>
          </nav>
        </div>
        {/* <div className="ml-auto flex items-center gap-4">
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
        </div> */}
      </header>

      <Separator />
    </>
  );
};

export default AdminPanelNavigation;
