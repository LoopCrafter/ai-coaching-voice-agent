"use client";
import { DiscussionRoomData } from "@/types";
import React, {
  FC,
  startTransition,
  useActionState,
  useMemo,
  useRef,
  useState,
} from "react";
import { Header } from "./Header";
import { GenerateFeedbackAndNotes } from "@/service/GlobalServices";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import ChatBox from "../discussionRoom/chatBox";
import { CoachingExpert } from "@/utils/consts/Options";
import { useDiscussion } from "@/hooks";
import { useGeneralStore } from "@/stores/generalStore";
import Screening from "./screening";
type MainWorkspace = {
  discussion: DiscussionRoomData;
  roomId: string;
};

type FeedbackState = {
  feedbackResult: any;
  feedbackText?: string | null;
};

export const MainWorkspace: FC<MainWorkspace> = ({ discussion, roomId }) => {
  const deepgramSocket = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const user = useGeneralStore((state) => state.user);

  const [showChat, setShowChat] = useState(false);
  const [enabledFeedback, setEnabledFeedback] = useState(false);
  const [micStatus, setMicStatus] = useState<
    "idle" | "connecting" | "listening"
  >("idle");
  const { audioUrl, coachingOption, conversations, setConversations } =
    useDiscussion({ discussion });

  const updateSummary = useMutation(api.DiscussionRoom.updateSummary);
  const [state, generateFeedback, isPending] = useActionState<FeedbackState>(
    async (prevState) => {
      try {
        const feedbackResult = await GenerateFeedbackAndNotes(
          discussion?.coachingOption ?? "",
          conversations
        );
        debugger;

        await updateSummary({
          id: roomId as Id<"DiscussionRoom">,
          feedback: feedbackResult.content,
        });

        toast("Feedback Saved!");

        return {
          ...prevState,
          feedbackResult,
          feedbackText: feedbackResult.content,
        };
      } catch (err) {
        debugger;
        toast.error("Something went wrong!");
        return prevState;
      }
    },
    {
      feedbackResult: null,
      feedbackText: "",
    }
  );

  const expert = useMemo(() => {
    return CoachingExpert.find((el) => (el.name = discussion?.expertName));
  }, [discussion, CoachingExpert]);

  const handleConnect = async () => {
    setMicStatus("connecting");
    const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";
    const url = `wss://api.deepgram.com/v1/listen?punctuate=true&language=en`;

    const socket = new WebSocket(url, ["token", deepgramApiKey]);
    deepgramSocket.current = socket;

    socket.onopen = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      });
      setMicStatus("listening");
      mediaRecorder.start(250);
    };

    socket.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      const transcript = data.channel?.alternatives[0]?.transcript;
      if (transcript) {
        console.log("Live Transcript:", transcript);
      }

      if (transcript && data.is_final) {
        setConversations((prev) => [
          ...prev,
          {
            role: "user",
            content: transcript,
          },
        ]);
      }
    };

    socket.onerror = (error) => {
      console.error("Deepgram socket error:", error);
    };

    socket.onclose = () => {
      console.log("Deepgram connection closed");
    };
  };
  const handleDisconnect = () => {
    setEnabledFeedback(true);
  };

  const handleClickGenerateFeedback = () => {
    startTransition(() => {
      generateFeedback();
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-2xl dark:text-white">
          {discussion?.coachingOption}
        </h2>
        <Header
          showChat={showChat}
          setShowChat={setShowChat}
          enabledFeedback={enabledFeedback}
          loading={isPending}
          generateFeedback={handleClickGenerateFeedback}
        />
      </div>
      <div
        className={`mt-5 grid ${showChat ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-2"} gap-10 relative`}
      >
        <Screening
          showChat={showChat}
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          userAvatar={user ? user.avatar : ""}
          micStatus={micStatus}
          expert={expert}
        />

        {showChat && (
          <div>
            <ChatBox
              conversations={conversations}
              enableFeedback={enabledFeedback}
              coachingOption={discussion?.coachingOption}
            />
          </div>
        )}
      </div>
      {!!audioUrl && (
        <audio key={audioUrl} className="invisible absolute w-0 h-0" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
        </audio>
      )}
    </>
  );
};
