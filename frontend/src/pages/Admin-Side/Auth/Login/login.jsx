import React, { useState, useId } from "react";
import AriaLogo from "@/assets/AriaLogo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { LoadingButton } from "@/components/ui/loading-button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn.email(
        { email, password, callbackURL: "/admin/dashboard" },
        {
          onSuccess: () => {
            // Handle successful login
            navigate("/admin/dashboard");
            // console.log("Login successful");
          },
          onError: (error) => {
            // Handle error
            console.error("Login failed", error);
            toast.error(
              "Invalid Email or Password. Please check your credentials."
            );
          },
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid Email or Password. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleEmailLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-6">
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
            <h1 className="text-xl font-semibold">
              Welcome back to Aria Feedback Panel
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="hello@example.com"
                readOnly={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter password here"
                  readOnly={isLoading}
                  required
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
            </div>
            <LoadingButton
              type="submit"
              className="mt-2 w-full bg-fountain-blue-400 hover:bg-fountain-blue-400/80 text-white hover:text-white"
              size="lg"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </LoadingButton>
          </div>
          {/* {errorMessage && (
            <span className="text-destructive text-center text-sm">
              {errorMessage}
            </span>
          )} */}
        </div>
      </form>

      <div className="text-center text-sm">
        <Link
          to="/admin/forgot-account"
          className="hover:underline underline-offset-4"
        >
          Forgot your password?{" "}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
