export type ExpertName = "Joanna" | "Salli" | "Joey";

export type Conversation = {
  role: "user" | "assistant";
  content: string;
  reasoning?: any;
  refusal?: any;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DiscussionRoomData =
  | {
      conversation?: any;
      coachingOption: string;
      topic: string;
      expertName: any;
      _id: string;
      _creationTime: number;
      summary?: string;
    }
  | null
  | undefined;
