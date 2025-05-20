"use client";
import { Conversation } from "@/app/(main)/discussion-room/[roomId]/page";
import { Button } from "@/components/ui/button";
import { GenerateFeedbackAndNotes } from "@/service/GlobalServices";
import { Coach } from "@/utils/consts/Options";
import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

type Chat = {
  conversations: Conversation[];
  enableFeedback: boolean;
  coachingOption?: string;
};

const ChatBox: FC<Chat> = ({
  conversations,
  enableFeedback,
  coachingOption = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { roomId } = useParams();
  const updateSummary = useMutation(api.DiscussionRoom.updateSummary);
  useEffect(() => {
    if (enableFeedback) {
    }
  }, []);

  const generateFeedback = async () => {
    setLoading(true);
    try {
      const feedbackResult = await GenerateFeedbackAndNotes(
        coachingOption,
        conversations
      );
      setFeedback(feedbackResult.content as string);
      updateSummary({
        id: roomId as Id<"DiscussionRoom">,
        feedback: feedbackResult.content,
      });
      toast("Feedback Saved!");
    } catch (e) {
      console.log(e);
      toast("Internal Server Error! try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-secondary h-[60vh] rounded-4xl items-center justify-center border flex flex-col relative">
        <div className="flex flex-col gap-4 p-5 h-full overflow-y-auto w-full">
          {conversations.map((conversation) => {
            return (
              <div
                key={conversation.content}
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
      {!enableFeedback ? (
        <h3 className="mt-4 text-gray-400 text-sm">
          {" "}
          at the end of your conversation we will automatically generate
          feedback / notes from your conversation{" "}
        </h3>
      ) : (
        <Button
          onClick={generateFeedback}
          disabled={loading}
          className="mt-4 w-full"
        >
          {" "}
          {loading ? (
            <Loader2Icon className={`${loading ? "animate-spin" : ""}`} />
          ) : (
            "Generate Feedback"
          )}{" "}
        </Button>
      )}
    </>
  );
};

export default ChatBox;
