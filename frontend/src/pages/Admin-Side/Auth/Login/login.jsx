import React, { useState } from "react";
import AriaLogo from "@/assets/AriaLogo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { LoadingButton } from "@/components/ui/loading-button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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
            console.log("Login successful");
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
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                placeholder="Enter password here"
                readOnly={isLoading}
                required
              />
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
