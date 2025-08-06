import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldXIcon, HomeIcon, MailIcon, ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

const AccessForbidden = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md text-center my-auto">
        {/* Icon and Error Code */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldXIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-700">
            Access Forbidden
          </h2>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            Sorry, you don't have permission to access this page. This could be
            because:
          </p>
          <ul className="text-sm text-gray-500 text-left space-y-1 mb-4">
            <li>• Your account doesn't have the required role</li>
            <li>• The page requires admin privileges</li>
            <li>• Your session may have expired</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to={"/admin/dashboard"} className="block">
            <Button className="w-full bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
              <HomeIcon className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessForbidden;
