import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const AccessForbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold text-red-500 mb-4">403</h1>
      <p className="text-xl mb-4">
        You do not have permission to access this page.
      </p>
      <Link to={"/admin/dashboard"}>
        <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default AccessForbidden;
