import React, { useState } from "react";
import AriaLogo from "@/assets/AriaLogo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { LoadingButton } from "@/components/ui/loading-button";
import { signUp } from "@/lib/auth-client";

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp.email(
        {
          email,
          password,
          name,
        //   callbackURL: "/admin/dashboard", // A URL to redirect to after the user verifies their email (optional)
        },
        {
          onSuccess: () => {
            navigate("/admin/dashboard");
          },
          onError: (error) => {
            console.error("Signup failed", error);
          },
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-6">
                <img
                  src={AriaLogo}
                  alt="Company Logo"
                  width={200}
                  height={100}
                />
                <h1 className="text-xl font-semibold">
                  Create an Admin Account
                </h1>
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="John Doe"
                    readOnly={isLoading}
                    required
                  />
                </div>
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
                    placeholder="Create a strong password"
                    readOnly={isLoading}
                    required
                  />
                </div>
                <LoadingButton
                  type="submit"
                  className="mt-2 w-full bg-fountain-blue-400 hover:bg-fountain-blue-400/80 text-white hover:text-white"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </LoadingButton>
              </div>
            </div>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-fountain-blue-400 hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
