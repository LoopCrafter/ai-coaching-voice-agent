import { AIModel, convertTextToSpeech } from "@/service/GlobalServices";
import { Conversation, DiscussionRoomData } from "@/types";
import { Coach, CoachingOptions } from "@/utils/consts/Options";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  discussion: DiscussionRoomData;
  updateUserTokenMethod: (text: string) => void;
};

export const useDiscussion = ({ discussion, updateUserTokenMethod }: Props) => {
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [computing, setComputing] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [coachingOption, setCoachingOption] = useState<Coach | null>(null);
  const updateConversation = useMutation(api.DiscussionRoom.updateConversation);

  useEffect(() => {
    if (!discussion) return;

    const coachingItem = CoachingOptions.find(
      (option) => option.name === discussion.coachingOption,
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
        setComputing(true);
        try {
          const AIanswer = (await AIModel(
            discussion?.topic ?? "",
            coachingOption,
            lastTwoMessage,
          )) as Conversation;
          const url = await convertTextToSpeech(
            AIanswer.content,
            discussion?.expertName,
          );
          setAudioUrl(url);
          await updateConversation({
            id: discussion?._id as Id<"DiscussionRoom">,
            conversation: [...conversations, AIanswer],
          });
          setConversations((prev: Conversation[]) => [...prev, AIanswer]);
          await updateUserTokenMethod(AIanswer.content);
        } catch (error) {
          console.log(error);
        } finally {
          setComputing(false);
        }
      }
    }
    fetchData();
  }, [conversations, coachingOption]);

  return {
    audioUrl,
    conversations,
    coachingOption,
    setConversations,
    computing,
  };
};
