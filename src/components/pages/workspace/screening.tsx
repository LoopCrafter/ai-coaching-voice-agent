import { Button } from "@/components/ui/button";
import { Expert } from "@/utils/consts/Options";
import { Camera, CameraOff, Loader2Icon, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import React, { FC, useState } from "react";
import UserScreen from "./UserScreen";
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
  const [camIsOn, setCamIsOn] = useState(false);
  const HandleConnectVideo = () => {
    setCamIsOn((prev) => !prev);
  };
  return (
    <div
      className={`select-none ${showChat ? "col-span-2" : "col-span-1"} h-[60vh] grid lg:grid-cols-2 gap-10 relative`}
    >
      <div className={`${showChat ? "col-span-2" : "col-span-1"}  h-full`}>
        <div className="bg-secondary dark:bg-gray-800 h-full rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col lg:relative">
          <div className="flex justify-center items-center flex-col gap-1">
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
          </div>

          <div className="absolute bottom-6 left-2 lg:left-1/2 transform lg:-translate-x-1/2 flex justify-center items-center gap-2">
            <Button
              onClick={HandleConnectVideo}
              variant={camIsOn ? "destructive" : "default"}
              size="lg"
              className={`rounded-full w-14 h-14  ${camIsOn ? "dark:bg-red-600 dark:hover:bg-red-700" : ""} transition-all duration-200 hover:scale-105`}
            >
              {camIsOn ? <Camera /> : <CameraOff />}
            </Button>
            {micStatus === "idle" ? (
              <Button
                onClick={handleConnect}
                size="lg"
                className="rounded-full w-14 h-14  transition-all duration-200 hover:scale-105"
              >
                <MicOff className="w-6 h-6" />
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
                <Mic className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <UserScreen
        showChat={showChat}
        userAvatar={userAvatar}
        camIsOn={camIsOn}
      />
    </div>
  );
};

export default Screening;
