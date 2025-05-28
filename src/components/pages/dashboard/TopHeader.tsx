"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { UserProfileDialog } from "./UserProfileDialog";

const TopHeader = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center">
      <div className="">
        <h2 className="font-medium text-gray-500 dark:text-zinc-400">
          My Workspace
        </h2>
        <h3 className="text-3xl font-bold dark:text-zinc-100">
          Welcome Back, {user?.username || ""}
        </h3>
      </div>
      <UserProfileDialog>
        <Button className="cursor-pointer dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">
          Profile
        </Button>
      </UserProfileDialog>
    </div>
  );
};

export default TopHeader;
