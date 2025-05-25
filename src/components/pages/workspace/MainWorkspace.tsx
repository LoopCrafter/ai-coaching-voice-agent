"use client";
import { Conversation, DiscussionRoomData } from "@/types";
import React, {
  FC,
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Header } from "./Header";
import {
  AIModel,
  GenerateFeedbackAndNotes,
  convertTextToSpeech,
} from "@/service/GlobalServices";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Image from "next/image";
import ChatBox from "../discussionRoom/chatBox";
import { CoachingExpert } from "@/utils/consts/Options";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Mic, MicOff } from "lucide-react";
import { useDiscussion } from "@/hooks";
import { useGeneralStore } from "@/stores/generalStore";
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
        <div className={showChat ? "lg:col-span-2" : "col-span-1"}>
          <div className="bg-secondary dark:bg-gray-800 h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
            {discussion?.expertName && (
              <Image
                src={expert?.avatar ?? ""}
                alt={expert?.name ?? ""}
                width={200}
                height={200}
                key={expert?.name}
                className={`w-[80px] h-[80px] rounded-full object-cover ${micStatus === "listening" ? "animate-pulse" : ""}`}
              />
            )}
            <h2 className="text-gray-500 dark:text-gray-400">{expert?.name}</h2>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              {micStatus === "idle" ? (
                <Button
                  onClick={handleConnect}
                  size="lg"
                  className="rounded-full w-14 h-14 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                >
                  <Mic className="w-6 h-6" />
                </Button>
              ) : micStatus === "connecting" ? (
                <div className="rounded-full w-14 h-14 bg-yellow-500 dark:bg-yellow-600 flex items-center justify-center">
                  <Loader2Icon className="animate-spin w-6 h-6" />
                </div>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  size="lg"
                  className="rounded-full w-14 h-14 dark:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 hover:scale-105"
                >
                  <MicOff className="w-6 h-6" />
                </Button>
              )}
            </div>

            {showChat && user && (
              <div className="absolute bottom-4 right-4 bg-secondary/80 dark:bg-gray-700/80 rounded-lg flex items-center gap-2 shadow-lg p-4">
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  You
                </span>
              </div>
            )}
          </div>
        </div>

        {!showChat && (
          <div className="col-span-1">
            <div className="bg-secondary dark:bg-gray-800 h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
              {user && (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <h2 className="text-gray-500 dark:text-gray-400 mt-2">You</h2>
            </div>
          </div>
        )}

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
