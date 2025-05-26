import React from "react";
import { useSession } from "@//lib/auth-client";
import { Navigate, useLocation, Outlet } from "react-router";
import { LoaderComponent } from "@/components/data-loader";

const ProtectedRoute = ({ children }) => {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return <LoaderComponent />;
  }

  if (!session) {
    return <Navigate to="admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
