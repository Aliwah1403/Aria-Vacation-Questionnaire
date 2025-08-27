import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { Eye, EyeOff } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const userCreateSchema = z.object({
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(3, "Last Name is required"),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, "Password needs to be minimum 8 characters"),
  role: z
    .enum(["admin", "user"], {
      required_error: "A role is required for the user",
    })
    .default("user"),
});

export default function CreateUserForm({ setCreateUserDialog }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const newUserForm = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onUserCreateSubmit = async (values) => {
    setIsLoading(true);
    try {
      const name =
        `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
      await authClient.admin.createUser(
        {
          name,
          email: values.email,
          password: values.password,
          role: values.role,
        },
        { throw: true }
      );

      toast.success("User created successfully");
      setCreateUserDialog(false);
      newUserForm.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // send email to new user's email saying they have been added, together with the credentials and link to admin login page
    } catch (error) {
      console.error("Failed to create new user: ", error);
      toast.error("Failed to create a new user. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 className="text-2xl font-semibold text-foreground dark:text-foreground">
          Add a new user
        </h3>
        <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          Take a few moments to add a new user for the feedback panel
        </p>
        <Form {...newUserForm}>
          <form
            onSubmit={newUserForm.handleSubmit(onUserCreateSubmit)}
            className="space-y-6 mt-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={newUserForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newUserForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={newUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newUserForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Password</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="password"
                          placeholder="*********"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className=" "
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={newUserForm.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role for the user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row space-x-2 items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCreateUserDialog(false)}
                type="button"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80 cursor-pointer"
              >
                Create User
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
