import React, { useState, useId } from "react";
import AriaLogo from "@/assets/AriaLogo.png";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { useSearchParams, useNavigate } from "react-router";
import { resetPassword } from "@/lib/auth-client";
import { set } from "date-fns";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const token = searchParams.get("token");
  if (!token) {
    return null; //will take to error page
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword({
        token,
        newPassword: password,
      });
      toast.success(
        "Your password has been reset successfully. You will be reditected to the login page"
      );
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
      setSearchParams({});
      setPassword("");
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
          <h1 className="text-xl font-semibold">Reset Password</h1>
        </div>
        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <LoadingButton
            type="submit"
            loading={isLoading}
            className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80 text-white hover:text-white "
          >
            Reset Password
          </LoadingButton>
          {/* <div className="text-center text-sm">
            <Link
              to={"/admin/login"}
              className="hover:underline underline-offset-4"
            >
              Back to Login
            </Link>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
