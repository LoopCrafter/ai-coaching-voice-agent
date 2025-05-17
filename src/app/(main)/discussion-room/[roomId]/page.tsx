"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { CoachingExpert, Expert } from "@/utils/consts/Options";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { debug } from "console";

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const { user } = useUser();
  console.log("user", user);
  const [expert, setExpert] = useState<Expert | null>(null);
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
            <Button>Connect</Button>
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
