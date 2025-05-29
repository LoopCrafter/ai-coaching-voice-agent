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
import { User, useGeneralStore } from "@/stores/generalStore";
import Markdown from "react-markdown";
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
  const updateUserToken = useMutation(api.users.updateUserToken);
  const user = useGeneralStore((state) => state.user);
  const setUser = useGeneralStore((state) => state.setUser);

  const [showChat, setShowChat] = useState(false);
  const [enabledFeedback, setEnabledFeedback] = useState(false);

  const updateUserTokenMethod = async (text: string) => {
    const tokenCount = text.trim() ? text.trim().length : 0;
    const currentCredit = Number(user?.credit) - Number(tokenCount);
    const result = await updateUserToken({
      id: user?._id as Id<"users">,
      credits: currentCredit,
    });
    if (user) {
      setUser({
        ...user,
        credit: currentCredit,
      });
    }
  };

  const [micStatus, setMicStatus] = useState<
    "idle" | "connecting" | "listening"
  >("idle");
  const { audioUrl, coachingOption, conversations, setConversations } =
    useDiscussion({ discussion, updateUserTokenMethod });

  const updateSummary = useMutation(api.DiscussionRoom.updateSummary);
  const [state, generateFeedback, isPending] = useActionState<FeedbackState>(
    async (prevState) => {
      try {
        const feedbackResult = await GenerateFeedbackAndNotes(
          discussion?.coachingOption ?? "",
          conversations
        );

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
    return CoachingExpert.find((el) => el.name === discussion?.expertName);
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
        await updateUserTokenMethod(transcript.trim());
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
    // Stop the media recorder if it exists and is recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks of the media stream to release the mic
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close the WebSocket connection if open
    if (
      deepgramSocket.current &&
      deepgramSocket.current.readyState === WebSocket.OPEN
    ) {
      deepgramSocket.current.close();
      deepgramSocket.current = null;
    }

    // Reset recorder ref
    mediaRecorderRef.current = null;

    // Update mic status
    setMicStatus("idle");
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
        className={`mt-5 grid ${showChat ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"} gap-10 relative`}
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
      {state.feedbackText && (
        <div className="mt-4 p-4 bg-secondary dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
            Feedback & Notes
          </h3>
          <Markdown>{state.feedbackText}</Markdown>
        </div>
      )}
      {!!audioUrl && (
        <audio key={audioUrl} className="invisible absolute w-0 h-0" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
        </audio>
      )}
    </>
  );
};
