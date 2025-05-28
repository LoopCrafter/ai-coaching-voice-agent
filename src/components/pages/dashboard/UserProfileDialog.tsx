import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGeneralStore } from "@/stores/generalStore";
import { Progress } from "@/components/ui/progress";

import Image from "next/image";
import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Wallet2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
};
export const UserProfileDialog: FC<Props> = ({ children }) => {
  const user = useGeneralStore((state) => state.user);
  console.log(user);
  const mainTokens = user?.subscriptionId ? 50000 : 500;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className="flex justify-start items-center gap-4 pb-3 mb-3 border-b border-gray-300">
                {!!user && (
                  <Image
                    src={user?.avatar}
                    alt={user.name}
                    width={100}
                    height={100}
                    className="w-[60px] h-[60px] rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <h2 className="font-bold text-black">{user?.name}</h2>
                  <h2 className="text-gray-600">{user?.email}</h2>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-start mb-2 gap-1">
                  <h5 className="font-bold text-black">Token Usage:</h5>
                  <h5 className=" text-gray-600">
                    {mainTokens - Number(user?.credit)} / {mainTokens}
                  </h5>
                </div>
                <div className="">
                  {!!user && (
                    <Progress
                      value={((mainTokens - user?.credit) * 100) / mainTokens}
                    />
                  )}
                </div>
                <div className="flex justify-between items-center my-3">
                  <span className="text-bold text-md">Current Plan:</span>
                  <span className="text-gray-600 text-md px-2 py-1 rounded-md bg-gray-100">
                    {user?.subscriptionId ? "Paid Plan" : "Free Plan"}
                  </span>
                </div>
                <div className="p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between pb-3 mb-3 border-b border-gray-200">
                    <div className="flex flex-col">
                      <h6 className="font-bold text-black">Pro Plan</h6>
                      <span className="text-gray-700 text-sm">
                        50,000 Tokens
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-black">$10/Month</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Wallet2 />
                    Upgrade $10
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
