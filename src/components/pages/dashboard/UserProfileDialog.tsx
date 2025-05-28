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

type Props = {
  children: React.ReactNode;
};
export const UserProfileDialog: FC<Props> = ({ children }) => {
  const user = useGeneralStore((state) => state.user);
  console.log(user);
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
                <div className="flex flex-col gap-1">
                  <h5 className="font-bold text-black">Current Token:</h5>
                  <h5 className=" text-gray-600">{user?.credit} / 500</h5>
                </div>
                <div className="">
                  {!!user && (
                    <Progress value={((500 - user?.credit) * 100) / 500} />
                  )}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
