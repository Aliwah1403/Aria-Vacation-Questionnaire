import React from "react";
import AdminPanelNavigation from "./Navigation/AdminPanelNavigation";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminPanelNavigation />
      <main className="flex-1 bg-[#00000008]">
        <Outlet />
        <Toaster richColors expand={true} position="top-center"/>
      </main>
    </div>
  );
};

export default AdminLayout;
