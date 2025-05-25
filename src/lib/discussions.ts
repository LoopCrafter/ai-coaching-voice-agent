import { DiscussionRoomData } from "@/types";

export const getDiscussionById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/discussionRoom?id=${id}`
  );
  const discussion: DiscussionRoomData = await res.json();

  return discussion;
};
