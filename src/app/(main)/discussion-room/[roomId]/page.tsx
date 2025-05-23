"use client";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import {
  Coach,
  CoachingExpert,
  CoachingOptions,
  Expert,
} from "@/utils/consts/Options";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  AIModel,
  convertTextToSpeech,
  GenerateFeedbackAndNotes,
} from "@/service/GlobalServices";
import { Loader2Icon, MessageSquare, Mic, MicOff } from "lucide-react";
import ChatBox from "@/components/pages/discussionRoom/chatBox";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";

export type Conversation = {
  role: "user" | "assistant";
  content: string;
  reasoning?: any;
  refusal?: any;
};

export type DiscussionRoomData =
  | {
      conversation?: any;
      coachingOption: string;
      topic: string;
      expertName: any;
      _id: string;
    }
  | null
  | undefined;

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const { user } = useUser();
  const [coachingOption, setCoachingOption] = useState<Coach | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const updateSummary = useMutation(api.DiscussionRoom.updateSummary);
  const deepgramSocket = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [enabledFeedback, setEnabledFeedback] = useState(false);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [micStatus, setMicStatus] = useState<
    "idle" | "connecting" | "listening"
  >("idle");

  const updateConversation = useMutation(api.DiscussionRoom.updateConversation);

  const discussionRoom: DiscussionRoomData = useQuery(
    api.DiscussionRoom.getDiscussionRoom,
    {
      id: roomId as any,
    }
  );

  useEffect(() => {
    async function fetchData() {
      if (conversations[conversations?.length - 1]?.role === "user") {
        const lastTwoMessage = conversations.slice(-2);
        const AIanswer = (await AIModel(
          discussionRoom?.topic ?? "",
          coachingOption,
          lastTwoMessage
        )) as Conversation;
        const url = await convertTextToSpeech(
          AIanswer.content,
          discussionRoom?.expertName
        );
        setAudioUrl(url);
        setConversations((prev) => [...prev, AIanswer]);
      }
    }
    fetchData();
  }, [conversations]);

  useEffect(() => {
    if (!discussionRoom) return;
    const selectedExpert = CoachingExpert.find(
      (expert) => expert.name === discussionRoom.expertName
    );
    const coachingItem = CoachingOptions.find(
      (option) => option.name === discussionRoom.coachingOption
    );
    if (coachingItem) {
      setCoachingOption(coachingItem);
    }
    if (discussionRoom?.conversation?.length) {
      setConversations(discussionRoom.conversation);
    }
    if (selectedExpert) {
      setExpert(selectedExpert);
    }
  }, [discussionRoom]);

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

  const handleDisconnect = (e: any) => {
    e.preventDefault();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("Error stopping mediaRecorder:", err);
      }
      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn("Error stopping media stream:", err);
      }
      mediaStreamRef.current = null;
    }

    if (deepgramSocket.current) {
      try {
        deepgramSocket.current.close();
      } catch (err) {
        console.warn("Error closing WebSocket:", err);
      }
      deepgramSocket.current = null;
    }

    if (discussionRoom?._id) {
      updateConversation({
        id: discussionRoom._id as Id<"DiscussionRoom">,
        conversation: conversations,
      });
    }

    setMicStatus("idle");
    setEnabledFeedback(true);
  };

  const generateFeedback = async () => {
    setLoading(true);

    try {
      const feedbackResult = await GenerateFeedbackAndNotes(
        discussionRoom?.coachingOption ?? "",
        conversations
      );
      const url = await convertTextToSpeech(
        feedbackResult.content as string,
        discussionRoom?.expertName
      );
      setAudioUrl(url);
      setFeedback(feedbackResult.content as string);
      updateSummary({
        id: roomId as Id<"DiscussionRoom">,
        feedback: feedbackResult.content,
      });
      toast("Feedback Saved!");
      setEnabledFeedback(false);
    } catch (e) {
      console.log(e);
      toast("Internal Server Error! try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-2xl dark:text-white">
          {discussionRoom?.coachingOption}
        </h2>
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
      </div>

      <div
        className={`mt-5 grid ${showChat ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-2"} gap-10 relative`}
      >
        <div className={showChat ? "lg:col-span-2" : "col-span-1"}>
          <div className="bg-secondary dark:bg-gray-800 h-[60vh] rounded-4xl items-center justify-center border dark:border-gray-700 flex flex-col relative">
            {expert && (
              <Image
                src={expert?.avatar ?? ""}
                alt={expert?.name ?? ""}
                width={200}
                height={200}
                key={expert.name}
                className={`w-[80px] h-[80px] rounded-full object-cover ${micStatus === "listening" ? "animate-pulse" : ""}`}
              />
            )}
            <h2 className="text-gray-500 dark:text-gray-400">{expert?.name}</h2>

            {/* Mic Control Button - Repositioned */}
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
                  src={user.imageUrl}
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
                  src={user.imageUrl}
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
              coachingOption={discussionRoom?.coachingOption}
            />
          </div>
        )}
      </div>
      {feedback && (
        <div className="mt-4 p-4 bg-secondary dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
            Feedback & Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {feedback.split("").map((char, index) => (
              <span
                key={index}
                style={{
                  animation: `fadeIn 0.1s ${index * 0.02}s forwards`,
                  opacity: 0,
                }}
              >
                {char}
              </span>
            ))}
          </p>
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {!!audioUrl && (
        <audio key={audioUrl} className="invisible absolute w-0 h-0" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
};

export default DiscussionRoom;
