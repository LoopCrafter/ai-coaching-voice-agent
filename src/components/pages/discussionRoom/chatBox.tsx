"use client";

import React, { FC } from "react";
import { Conversation } from "@/types";

type Chat = {
  conversations: Conversation[];
  enableFeedback: boolean;
  coachingOption?: string;
};

const ChatBox: FC<Chat> = ({ conversations }) => {
  return (
    <>
      <div className="bg-secondary dark:bg-gray-800 h-[40vh] lg:h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
        <div className="flex flex-col gap-4 p-5 h-full overflow-y-auto w-full">
          {conversations.map((conversation, index) => {
            return (
              <div
                key={index}
                className={`flex ${conversation.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {conversation.role === "user" ? (
                  <h2 className="p-1 px-2 bg-gray-200 dark:bg-gray-700 mt-1 rounded-md dark:text-white">
                    {conversation.content}
                  </h2>
                ) : (
                  <h2 className="p-1 px-2 bg-primary dark:bg-blue-600 mt-1 text-white rounded-md inline-block">
                    {conversation.content}
                  </h2>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatBox;
