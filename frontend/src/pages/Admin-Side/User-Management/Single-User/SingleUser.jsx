import React from "react";
import AdminPageHeader from "@/components/admin-page-header";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SingleUser = () => {
  return (
    <>
      <AdminPageHeader
        header="Curtis Aliwah"
        description="Last active yesterday"
        action={
          <Link to={"/admin/users"}>
            <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
              <MoveLeftIcon />
              Back to users
            </Button>
          </Link>
        }
      />

      <div className="p-4 md:p-6">
        <Tabs>
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger className="data-[state=active]:after:bg-fountain-blue-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0">
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SingleUser;
