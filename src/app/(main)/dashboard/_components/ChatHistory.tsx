"use client";

import ChatBox from "@/components/pages/discussionRoom/chatBox";
import { useGeneralStore } from "@/stores/generalStore";
import { DiscussionRoomData } from "@/types";
import { CoachingExpert } from "@/utils/consts/Options";
import { useMemo } from "react";

type ChatHistoryProp = {
  discussion: DiscussionRoomData;
};
const ChatHistory = ({ discussion }: ChatHistoryProp) => {
  const user = useGeneralStore((state) => state.user);
  const expert = useMemo(() => {
    return CoachingExpert.find((el) => el.name === discussion?.expertName);
  }, [discussion, CoachingExpert, CoachingExpert]);
  return (
    <ChatBox
      conversations={discussion?.conversation}
      enableFeedback={false}
      userAvatar={user ? user.avatar : ""}
      expert={expert}
    />
  );
};

export default ChatHistory;
