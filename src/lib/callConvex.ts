export async function callConvexFunction<T>(
  funcName: string,
  type: "query" | "mutation",
  args: Record<string, any>
): Promise<T> {
  // const url = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/functions/${type}/${funcName}`;
  const url =
    "https://benevolent-gazelle-367.convex.cloud/api/functions/query/discussionRoom:getDiscussionRoom";
  console.log("++++++", url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CONVEX_DEPLOYMENT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  console.log("++++++", res);
  if (!res.ok) {
    const error = await res.text();
    console.error(
      `Convex ${type} failed: Status ${res.status}, Error: ${error}`
    );
    throw new Error(`Convex ${type} failed: ${error}`);
  }

  return res.json();
}
