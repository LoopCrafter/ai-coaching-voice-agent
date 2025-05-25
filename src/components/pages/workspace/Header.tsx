import { Button } from "@/components/ui/button";
import { Loader2Icon, MessageSquare } from "lucide-react";
import React, { FC } from "react";

type Header = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  loading: boolean;
  enabledFeedback: boolean;
  generateFeedback: () => void;
};

export const Header: FC<Header> = ({
  showChat,
  setShowChat,
  enabledFeedback,
  loading,
  generateFeedback,
}) => {
  return (
    <div className="flex gap-4">
      {enabledFeedback && (
        <Button
          disabled={loading}
          variant="outline"
          className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 w-48"
          onClick={generateFeedback}
        >
          {loading ? (
            <Loader2Icon className={`${loading ? "animate-spin" : ""}`} />
          ) : (
            "Generate Feedback"
          )}
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => setShowChat(!showChat)}
        className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        {showChat ? "Hide Chat" : "Show Chat"}
      </Button>
    </div>
  );
};
