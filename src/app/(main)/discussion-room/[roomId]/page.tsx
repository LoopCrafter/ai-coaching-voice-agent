"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { CoachingExpert, Expert } from "@/utils/consts/Options";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const { user } = useUser();
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscripts, setFinalTranscripts] = useState<string[]>([]);

  const deepgramSocket = useRef<WebSocket | null>(null);

  console.log("user", user);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [micStatus, setMicStatus] = useState<
    "idle" | "connecting" | "listening"
  >("idle");

  const discussionRoom = useQuery(api.DiscussionRoom.getDiscussionRoom, {
    id: roomId as any,
  });

  useEffect(() => {
    if (!discussionRoom) return;
    const selectedExpert = CoachingExpert.find(
      (expert) => expert.name === discussionRoom.expertName
    );
    if (selectedExpert) {
      setExpert(selectedExpert);
    }
  }, [discussionRoom]);

  const handleConnect = async () => {
    setMicStatus("connecting");
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY ?? "";
    const url = `wss://api.deepgram.com/v1/listen?punctuate=true&language=en`;

    const socket = new WebSocket(url, ["token", deepgramApiKey]);
    deepgramSocket.current = socket;

    socket.onopen = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      });
      setMicStatus("listening");
      mediaRecorder.start(250); // Send chunks every 250ms
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const transcript = data.channel?.alternatives[0]?.transcript;
      if (transcript) {
        console.log("Live Transcript:", transcript);
        // Set this to state if needed
      }
      if (transcript && !data.is_final) {
        setLiveTranscript(transcript);
      }

      if (transcript && data.is_final) {
        setFinalTranscripts((prev) => [...prev, transcript]);
        setLiveTranscript("");
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
    if (deepgramSocket.current) {
      deepgramSocket.current.close();
      deepgramSocket.current = null;
    }
    setMicStatus("idle");
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
                className="w-[80px] h-[80px] rounded-full object-cover animate-pulse"
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
            </div>
          </div>
          <div className="flex justify-center items-center mt-4">
            {micStatus === "idle" ? (
              <Button onClick={handleConnect}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnect}>
                disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="bg-secondary h-[60vh] rounded-4xl items-center justify-center border flex flex-col relative">
            <h2>Chat Section</h2>
            <div className="mt-4 p-4 border rounded-xl bg-muted text-primary font-mono space-y-1 text-sm">
              {finalTranscripts.map((t, idx) => (
                <p key={idx}>{t}</p>
              ))}
              {liveTranscript && (
                <p className="italic text-muted-foreground">{liveTranscript}</p>
              )}
            </div>
            <div className="mt-4 p-4 border rounded-xl bg-muted text-primary font-mono min-h-[40px]">
              {liveTranscript ? (
                <p>{liveTranscript}</p>
              ) : micStatus === "connecting" ? (
                <p className="opacity-50 italic">Connecting to microphone...</p>
              ) : micStatus === "listening" ? (
                <p className="opacity-50 italic">Listening...</p>
              ) : (
                <p className="opacity-50 italic">Click connect to start</p>
              )}
            </div>
          </div>
          <h3 className="mt-4 text-gray-400 text-sm">
            {" "}
            at the end of your conversation we will automatically generate
            feedback / notes from your conversation{" "}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
