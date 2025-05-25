import { AIModel, convertTextToSpeech } from "@/service/GlobalServices";
import { Conversation, DiscussionRoomData } from "@/types";
import { Coach, CoachingExpert, CoachingOptions } from "@/utils/consts/Options";
import React, { useEffect, useState } from "react";

type Props = {
  discussion: DiscussionRoomData;
};

export const useDiscussion = ({ discussion }: Props) => {
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [coachingOption, setCoachingOption] = useState<Coach | null>(null);

  useEffect(() => {
    if (!discussion) return;
    const selectedExpert = CoachingExpert.find(
      (expert) => expert.name === discussion.expertName
    );
    const coachingItem = CoachingOptions.find(
      (option) => option.name === discussion.coachingOption
    );
    if (coachingItem) {
      setCoachingOption(coachingItem);
    }
    if (discussion?.conversation?.length) {
      setConversations(discussion.conversation);
    }
  }, [discussion]);

  useEffect(() => {
    async function fetchData() {
      if (conversations[conversations?.length - 1]?.role === "user") {
        const lastTwoMessage = conversations.slice(-2);
        const AIanswer = (await AIModel(
          discussion?.topic ?? "",
          coachingOption,
          lastTwoMessage
        )) as Conversation;
        const url = await convertTextToSpeech(
          AIanswer.content,
          discussion?.expertName
        );
        setAudioUrl(url);
        setConversations((prev: Conversation[]) => [...prev, AIanswer]);
      }
    }
    fetchData();
  }, [conversations]);

  return { audioUrl, conversations, coachingOption, setConversations };
};
