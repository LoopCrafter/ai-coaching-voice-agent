import ChatBox from "@/components/pages/discussionRoom/chatBox";
import Summarybox from "@/components/pages/summary/Summarybox";
import { getAbstractImage } from "@/lib/getAbstractImage";
import { getFormattedTime } from "@/lib/getFormattedTime";
import { DiscussionRoomData } from "@/types";
import Image from "next/image";
import React from "react";

const Summary = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = await params;
  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/discussionRoom?id=${roomId}`
  );
  const discussion: DiscussionRoomData = await res.json();
  console.log("+++++++", discussion);
  return (
    <div>
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
        <h4 className="text-gray-400 text-xs">
          {getFormattedTime(+(discussion?._creationTime ?? ""))}
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="col-span-3">
          <Summarybox summary={discussion?.summary} />
        </div>
        <div className="col-span-2">
          {!!discussion?.conversation.length && (
            <ChatBox
              conversations={discussion?.conversation}
              enableFeedback={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
