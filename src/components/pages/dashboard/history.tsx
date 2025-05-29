import { Button } from "@/components/ui/button";
import { getDiscussionHistoryServer } from "@/lib/convexServer";
import { clerkClient as getClerkClient, auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getFormattedTime } from "@/lib/getFormattedTime";
import Link from "next/link";
import { getAbstractImage } from "@/lib/getAbstractImage";

export default async function History() {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const clerkClient = await getClerkClient();
  const user = await clerkClient.users.getUser(userId);

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) return <div>Email not found</div>;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user?email=${encodeURIComponent(email)}`
  );
  const userData = await res.json();

  if (!userData?._id) return <div>User not found</div>;
  const history = await getDiscussionHistoryServer(userData._id);

  return (
    <div>
      <h2 className="text-lg font-bold">Your Previous Lecture: </h2>
      {history.length === 0 ? (
        <h2 className="text-gray-400">
          You don&apos;t have any previous lectures{" "}
        </h2>
      ) : (
        <div className="mt-5">
          {history
            .filter(
              (el) =>
                el.coachingOption !== "Topic Base Lecture" &&
                el.coachingOption !== "Learn Language"
            )
            .map((item) => (
              <div key={item._id}>
                <Link
                  href={`/dashboard/summary/${item._id}`}
                  className="flex justify-between items-center border-b-2 pb-3 mb-3 group"
                >
                  <div className="flex justify-start items-center gap-3 ">
                    <Image
                      src={getAbstractImage(item.coachingOption)}
                      alt={item.coachingOption}
                      width={100}
                      height={100}
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{item.topic}</h3>
                      <h4 className="text-gray-400 text-md">
                        {item.coachingOption}
                      </h4>
                      <h4 className="text-gray-400 text-xs">
                        {getFormattedTime(item._creationTime)}
                      </h4>
                    </div>
                  </div>

                  <Button
                    variant={"outline"}
                    className="opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {" "}
                    View Notes
                  </Button>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
