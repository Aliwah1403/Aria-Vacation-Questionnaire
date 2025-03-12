import React from "react";
import { Separator } from "@/components/ui/separator";

const AdminPageHeader = ({ header, description, action }) => {
  return (
    <>
      <div className="bg-background px-4 py-6 md:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{header}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2">{action}</div>
        </div>
      </div>

      <Separator />
    </>
  );
};

export default AdminPageHeader;
