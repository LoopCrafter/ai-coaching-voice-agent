"use client";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
import { AIModel, convertTextToSpeech } from "@/service/GlobalServices";
import { Loader2Icon, LoaderCircle } from "lucide-react";
import ChatBox from "@/components/pages/discussionRoom/chatBox";
import { ExpertName } from "@/types";
import { Id } from "../../../../../convex/_generated/dataModel";

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
  const deepgramSocket = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [enabledFeedback, setEnabledFeedback] = useState(false);
  const [expert, setExpert] = useState<Expert | null>(null);
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
        console.log("uelr", url);
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
      mediaRecorder.start(250); // Send chunks every 250ms
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

    // 1. Stop the MediaRecorder
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

    // 2. Stop the audio stream (microphone)
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn("Error stopping media stream:", err);
      }
      mediaStreamRef.current = null;
    }

    // 3. Close Deepgram WebSocket connection
    if (deepgramSocket.current) {
      try {
        deepgramSocket.current.close();
      } catch (err) {
        console.warn("Error closing WebSocket:", err);
      }
      deepgramSocket.current = null;
    }

    // 4. Update conversation (optional)
    if (discussionRoom?._id) {
      updateConversation({
        id: discussionRoom._id as Id<"DiscussionRoom">,
        conversation: conversations,
      });
    }

    // 5. Update mic status
    setMicStatus("idle");

    setEnabledFeedback(true);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">{discussionRoom?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
        <div className="lg:col-span-2 ">
          <div className="bg-secondary h-[60vh] rounded-4xl items-center justify-center border flex flex-col relative">
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
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              {user && (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              {!!audioUrl && (
                <audio
                  key={audioUrl}
                  className="invisible absolute w-0 h-0"
                  autoPlay
                >
                  <source src={audioUrl} type="audio/mp3" />
                </audio>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center mt-4">
            {micStatus === "idle" ? (
              <Button onClick={handleConnect}>Connect</Button>
            ) : micStatus === "connecting" ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Button variant="destructive" onClick={handleDisconnect}>
                disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <ChatBox
            conversations={conversations}
            enableFeedback={enabledFeedback}
            coachingOption={discussionRoom?.coachingOption}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
