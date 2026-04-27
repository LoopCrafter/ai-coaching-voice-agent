import ChatBox from "@/components/pages/discussionRoom/chatBox";
import Summarybox from "@/components/pages/summary/Summarybox";
import { getDiscussionById } from "@/lib/discussions";
import { getAbstractImage } from "@/lib/getAbstractImage";
import { getFormattedTime } from "@/lib/getFormattedTime";
import { useGeneralStore } from "@/stores/generalStore";
import Image from "next/image";
import ChatHistory from "../../_components/ChatHistory";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const Summary = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = await params;

  const discussion = await getDiscussionById(roomId);
  return (
    <div className="p-3 lg:p-10 ">
      <div className="flex justify-between items-end mb-6">
        <div className="flex justify-start items-center gap-4">
          <Image
            src={getAbstractImage(discussion?.coachingOption ?? "")}
            alt={discussion?.topic || ""}
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full"
          />
          <div>
            <h1 className="font-bold">{discussion?.topic ?? ""}</h1>
            <h3 className="text-gray-400">
              {discussion?.coachingOption ?? ""}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/workspace/${discussion?._id}`}
            className={buttonVariants()}
          >
            Back to Discussion
          </Link>
          <h4 className="text-gray-400 text-xs">
            {getFormattedTime(+(discussion?._creationTime ?? ""))}
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="col-span-3">
          <Summarybox discussion={discussion} summary={discussion?.summary} />
        </div>
        <div className="col-span-2">
          {!!discussion?.conversation?.length && (
            <ChatHistory discussion={discussion} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
