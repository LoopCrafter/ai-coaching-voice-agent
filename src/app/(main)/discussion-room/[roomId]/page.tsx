"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { CoachingExpert, Expert } from "@/utils/consts/Options";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

let silenceTimeout: ReturnType<typeof setTimeout>;

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const { user } = useUser();
  const recorder = useRef<any | null>(null);
  const realtimeTranscriber = useRef<{
    transcribe: (buffer: ArrayBuffer) => Promise<void>;
  } | null>(null);

  console.log("user", user);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [enableMic, setEnableMic] = useState(false);
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
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      console.error("Browser environment not supported");
      return;
    }
    let stream = null;
    setEnableMic(true);
    try {
      const RecordRTCModule = await import("recordrtc");
      const RecordRTC = RecordRTCModule.default || RecordRTCModule;
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob) => {
          if (!realtimeTranscriber.current) return;
          const buffer = await blob.arrayBuffer();
          // Example: Send buffer to transcription service
          await realtimeTranscriber.current.transcribe(buffer);
          silenceTimeout = setTimeout(() => {
            console.log("User stopped talking");
            //handleDisconnect(); // Stop recording on silence
          }, 2000);
        },
      });
      // recorder.current.startRecording();
    } catch (err) {
      console.error("Failed to access microphone:", err);
      // Notify user (e.g., show UI error)
    }
  };

  const handleDisconnect = (e: any) => {
    e.preventDefault();
    if (recorder.current) {
      recorder.current.pauseRecording();
      recorder.current = null;
      setEnableMic(false);
    }
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
            {!enableMic ? (
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
