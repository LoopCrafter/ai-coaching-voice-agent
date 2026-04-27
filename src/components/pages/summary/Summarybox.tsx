"use client";
import { Button } from "@/components/ui/button";
import { DiscussionRoomData } from "@/types";
import { Loader2Icon } from "lucide-react";
import React, { FC, startTransition, useState } from "react";
import Markdown from "react-markdown";
type Props = {
  summary?: string;
  discussion: DiscussionRoomData;
};
const Summarybox: FC<Props> = ({ summary, discussion }) => {
  const [loading, setLoading] = useState(false);

  const handleClickGenerateFeedback = () => {
    startTransition(() => {
      // generateFeedback();
    });
  };
  return (
    <div className="h-[60vh] overflow-auto">
      <h1 className="font-bold mb-4">Summary of Your Conversation</h1>
      {!summary ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center mt-10">
          <p className="text-md text-left text-gray-500 mb-4 flex-1">
            There is no summary yet. Generate feedback to see insights from your
            conversation.
          </p>
          <Button
            disabled={loading}
            variant="outline"
            className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 w-full md:w-48 my-10"
            onClick={handleClickGenerateFeedback}
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Generate Feedback"
            )}
          </Button>
        </div>
      ) : (
        <Markdown>{summary}</Markdown>
      )}
    </div>
  );
};

export default Summarybox;
