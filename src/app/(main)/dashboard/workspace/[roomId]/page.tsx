import { MainWorkspace } from "@/components/pages/workspace";
import { getDiscussionById } from "@/lib/discussions";
import { redirect } from "next/navigation";
import React from "react";

const Workspace = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;
  let discussion;
  try {
    discussion = await getDiscussionById(roomId);
  } catch (e) {
    throw redirect("/dashboard");
  }

  return (
    <div className="h-screen p-4 ">
      <MainWorkspace discussion={discussion} roomId={roomId} />
    </div>
  );
};

export default Workspace;
