import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import AdminPageHeader from "@/components/admin-page-header";
import { Button } from "@/components/ui/button";
import { dummyUsers } from "./dummyUsers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagementTable } from "./users-table";
import { usersColumns } from "./columns";
import { authClient } from "@/lib/auth-client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { LoaderComponent } from "@/components/data-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateUserForm from "./create-user-form";

const Users = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [createUserDialog, setCreateUserDialog] = useState(false);

  const { data: users, isPending: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await authClient.admin.listUsers(
        {
          query: {
            searchField: "email",
            searchOperator: "contains",
            limit: 10,
            sortBy: "createdAt",
            sortDirection: "desc",
          },
        },
        { throw: true }
      );
      return data?.users || [];
    },
  });

  console.log("Users data:", users);

  if (isUsersLoading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <AdminPageHeader
        header="Users"
        description="Manage the users in your organization"
        action={
          <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
                Create user
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CreateUserForm setCreateUserDialog={setCreateUserDialog} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-4 md:p-6">
        <Tabs>
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              All
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0">
            <UserManagementTable columns={usersColumns} data={users || []} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Users;
