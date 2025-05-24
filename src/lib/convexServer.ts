import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDiscussionHistoryServer(uid: Id<"users">) {
  const data = await convex.query(api.DiscussionRoom.getDiscussionsHistory, {
    uid,
  });
  return data;
}

export async function getUserByEmailServer(email: string) {
  const user = await convex.query(api.users.getUserByEmail, { email });
  return user;
}
