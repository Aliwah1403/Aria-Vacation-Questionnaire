import React from "react";
import { useSession } from "@/lib/auth-client";
import { Navigate, useLocation, Outlet } from "react-router";
import { LoaderComponent } from "@/components/data-loader";
import AccessForbidden from "@/AccessForbidden";

const RoleRoute = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <LoaderComponent />;
  }

  if (session.user?.role !== "admin") {
    return <AccessForbidden />;
  }

  return <Outlet />;
};

export default RoleRoute;
