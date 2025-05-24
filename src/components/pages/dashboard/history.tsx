import { getDiscussionHistoryServer } from "@/lib/convexServer";
import { clerkClient as getClerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function History() {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const clerkClient = await getClerkClient();
  const user = await clerkClient.users.getUser(userId);

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) return <div>Email not found</div>;

  const res = await fetch(
    `http://localhost:3000/api/user?email=${encodeURIComponent(email)}`
  );
  const userData = await res.json();

  if (!userData?._id) return <div>User not found</div>;
  const history = await getDiscussionHistoryServer(userData._id);
  console.log("++++gg", history);
  return <div>User email: {email}</div>;
}
