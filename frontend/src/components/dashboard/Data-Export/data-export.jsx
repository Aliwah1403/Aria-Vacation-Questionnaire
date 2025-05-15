import React from "react";
import { Button } from "../../ui/button";
import { DownloadIcon } from "lucide-react";

// Component will export the data in dashboard into pdf format
const DashboardDataExport = () => {
  return (
    <Button variant="outline" className="w-full" size="lg">
      <DownloadIcon />
      <span>Export Data</span>
    </Button>
  );
};

export default DashboardDataExport;
