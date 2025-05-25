import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import AriaLogo from "@/assets/AriaLogo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { forgetPassword } from "@/lib/auth-client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgetPassword({
        email: email,
        redirectTo: `${window.location.origin}/admin/forgot-account/reset-password`,
      });
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      console.error("Error sending reset password email:", error);
      toast.error("Failed to send reset password email. Please try again.");
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-md mx-auto space-y-4 container"
      >
        <div className="flex flex-col items-center gap-6 mb-10">
          <img src={AriaLogo} alt="Company Logo" width={200} height={100} />
          {/* <a
                       href="#"
                       className="flex flex-col items-center gap-2 font-medium"
                     >
                       <div className="flex h-8 w-8 items-center justify-center rounded-md">
                         <GalleryVerticalEnd className="size-6" />
                       </div>
                       <span className="sr-only">Acme Inc.</span>
                     </a> */}
          <h1 className="text-xl font-semibold">Forgot Password</h1>
        </div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <div className="flex flex-col gap-3">
          <LoadingButton
            type="submit"
            loading={isLoading}
            className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80 text-white hover:text-white "
          >
            Reset Password
          </LoadingButton>
          <div className="text-center text-sm">
            <Link
              to={"/admin/login"}
              className="hover:underline underline-offset-4"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
