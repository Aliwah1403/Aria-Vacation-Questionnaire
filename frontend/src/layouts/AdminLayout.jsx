import React from "react";
import AdminPanelNavigation from "./Navigation/AdminPanelNavigation";
import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminPanelNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
