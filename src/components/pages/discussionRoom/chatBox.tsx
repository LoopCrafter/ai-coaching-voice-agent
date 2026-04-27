"use client";

import { FC } from "react";
import { Conversation } from "@/types";
import Image from "next/image";
import { Expert } from "@/utils/consts/Options";

type Chat = {
  conversations: Conversation[];
  enableFeedback: boolean;
  coachingOption?: string;
  computing?: boolean;
  expert?: Expert;
  userAvatar: string;
};

const ChatBox: FC<Chat> = ({
  conversations,
  computing,
  expert,
  userAvatar,
}) => {
  const experAvatar = expert?.avatar || "";
  return (
    <>
      <div className="bg-secondary dark:bg-gray-800 h-[40vh] lg:h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
        <div className="flex flex-col gap-4 p-5 h-full overflow-y-auto w-full">
          {conversations.map((conversation, index) => {
            return (
              <div
                key={index}
                className={`flex ${conversation.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
              >
                {conversation.role === "user" ? (
                  <>
                    <h2 className="p-1 px-2 bg-gray-200 dark:bg-gray-700 mt-1 rounded-md dark:text-white">
                      {conversation.content}
                    </h2>
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt="Profile"
                        width={34}
                        height={34}
                        className="rounded-full"
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    {experAvatar ? (
                      <Image
                        src={experAvatar}
                        alt={expert?.name ?? ""}
                        width={34}
                        height={34}
                        className={`w-[34px] h-[34px] rounded-full object-cover`}
                      />
                    ) : null}
                    <h2 className="p-1 px-2 bg-primary dark:bg-blue-600 mt-1 text-white rounded-md inline-block">
                      {conversation.content}
                    </h2>
                  </>
                )}
              </div>
            );
          })}
          {computing ? (
            <div className="justify-start gap-2 flex items-center ">
              <Image
                src={expert?.avatar ?? ""}
                alt={expert?.name ?? ""}
                width={34}
                height={34}
                className={`w-[34px] h-[34px] rounded-full object-cover`}
              />
              <div className="flex items-center gap-1">
                <span className="size-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-1 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ChatBox;
