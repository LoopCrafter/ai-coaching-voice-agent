import { Button } from "@/components/ui/button";
import { Expert } from "@/utils/consts/Options";
import { Loader2Icon, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";
type Screening = {
  showChat: boolean;
  expert?: Expert;
  micStatus: "idle" | "connecting" | "listening";
  userAvatar: string;
  handleConnect: () => void;
  handleDisconnect: () => void;
};
const Screening: FC<Screening> = ({
  showChat,
  expert,
  micStatus,
  userAvatar,
  handleConnect,
  handleDisconnect,
}) => {
  return (
    <>
      <div className={showChat ? "lg:col-span-2" : "col-span-1"}>
        <div className="bg-secondary dark:bg-gray-800 h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
          {expert && (
            <Image
              src={expert?.avatar ?? ""}
              alt={expert?.name ?? ""}
              width={200}
              height={200}
              key={expert?.name}
              className={`w-[80px] h-[80px] rounded-full object-cover ${micStatus === "listening" ? "animate-pulse" : ""}`}
            />
          )}
          <h2 className="text-gray-500 dark:text-gray-400">{expert?.name}</h2>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            {micStatus === "idle" ? (
              <Button
                onClick={handleConnect}
                size="lg"
                className="rounded-full w-14 h-14 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : micStatus === "connecting" ? (
              <div className="rounded-full w-14 h-14 bg-yellow-500 dark:bg-yellow-600 flex items-center justify-center">
                <Loader2Icon className="animate-spin w-6 h-6" />
              </div>
            ) : (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                size="lg"
                className="rounded-full w-14 h-14 dark:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 hover:scale-105"
              >
                <MicOff className="w-6 h-6" />
              </Button>
            )}
          </div>

          {showChat && userAvatar && (
            <div className="absolute bottom-4 right-4 bg-secondary/80 dark:bg-gray-700/80 rounded-lg flex items-center gap-2 shadow-lg p-4">
              <Image
                src={userAvatar}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                You
              </span>
            </div>
          )}
        </div>
      </div>
      {!showChat && (
        <div className="col-span-1">
          <div className="bg-secondary dark:bg-gray-800 h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
            {userAvatar && (
              <Image
                src={userAvatar}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <h2 className="text-gray-500 dark:text-gray-400 mt-2">You</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Screening;
