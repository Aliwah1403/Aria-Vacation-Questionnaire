import React from "react";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

const AdminAuthLayout = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
        <Toaster richColors expand={true} position="top-center" />
      </div>
    </div>
  );
};

export default AdminAuthLayout;
