import { Conversation } from "@/app/(main)/discussion-room/[roomId]/page";
import React, { FC } from "react";

type Chat = {
  conversations: Conversation[];
};

const ChatBox: FC<Chat> = ({ conversations }) => {
  return (
    <div className="bg-secondary h-[60vh] rounded-4xl items-center justify-center border flex flex-col relative">
      <div className="flex flex-col gap-4 p-5 h-full overflow-y-auto">
        {conversations.map((conversation) => {
          return (
            <div
              className={` flex ${conversation.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {conversation.role === "user" ? (
                <h2 className="p-1 px-2 bg-gray-200 mt-1  rounded-md ">
                  {conversation.content}
                </h2>
              ) : (
                <h2 className="p-1 px-2 bg-primary mt-1 text-white  rounded-md inline-block">
                  {conversation.content}
                </h2>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBox;
