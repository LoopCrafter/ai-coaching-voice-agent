"use client";
import { Button } from "@/components/ui/button";
import { DiscussionRoomData } from "@/types";
import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { FC, useTransition } from "react";
import Markdown from "react-markdown";
import { api } from "../../../../convex/_generated/api";
import { GenerateFeedbackAndNotes } from "@/service/GlobalServices";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
type Props = {
  summary?: string;
  discussion: DiscussionRoomData;
};
const Summarybox: FC<Props> = ({ summary, discussion }) => {
  const [isPending, startTransition] = useTransition();
  const updateSummary = useMutation(api.DiscussionRoom.updateSummary);
  const router = useRouter();

  const handleClickGenerateFeedback = () => {
    startTransition(async () => {
      try {
        const feedbackResult = await GenerateFeedbackAndNotes(
          discussion?.coachingOption ?? "",
          discussion?.conversation ?? [],
        );

        await updateSummary({
          id: discussion?._id as Id<"DiscussionRoom">,
          feedback: feedbackResult.content,
        });
        router.refresh();
      } catch (error) {
        console.log(error);
      }
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
            disabled={isPending}
            variant="outline"
            className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 w-full md:w-48 my-10"
            onClick={handleClickGenerateFeedback}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Generate Feedback"
            )}
          </Button>
        </div>
      ) : (
        <div className="preview">
          <Markdown>{summary}</Markdown>
        </div>
      )}
    </div>
  );
};

export default Summarybox;
