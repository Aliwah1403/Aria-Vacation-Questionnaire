import React from "react";
import { NavLink } from "react-router"; // Change from Link to NavLink
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AriaLogo from "@/assets/AriaLogo.png";
import { Separator } from "@/components/ui/separator";

const AdminPanelNavigation = () => {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-background px-4 md:px-6">
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
