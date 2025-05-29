import Image from "next/image";
import { FC, useState } from "react";
import Webcam from "react-webcam";
type Props = {
  userAvatar: string;
  showChat: boolean;
  camIsOn: boolean;
};

const UserScreen: FC<Props> = ({ userAvatar, showChat, camIsOn }) => {
  return (
    <div
      className={`${showChat ? "absolute bottom-4 right-4 w-[180px] h-[110px]" : "col-span-1 h-full"} bg-secondary dark:bg-gray-800  rounded-2xl items-center justify-center border dark:border-gray-700 flex flex-col overflow-hidden`}
    >
      {camIsOn ? (
        <Webcam
          className="w-full h-full object-cover"
          forceScreenshotSourceSize
          screenshotQuality={1}
        />
      ) : (
        <div className="flex justify-center items-center flex-col gap-1">
          {userAvatar && (
            <Image
              src={userAvatar}
              alt="Profile"
              width={showChat ? 40 : 80}
              height={showChat ? 40 : 80}
              className="rounded-full"
            />
          )}
          <h2 className="text-gray-500 dark:text-gray-400">You</h2>
        </div>
      )}
    </div>
  );
};

export default UserScreen;
