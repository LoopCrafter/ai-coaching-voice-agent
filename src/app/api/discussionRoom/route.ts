// app/api/discussionRoom/route.ts
import { callConvexFunction } from "@/lib/callConvex";
import { NextRequest, NextResponse } from "next/server";

// GET: /api/discussionRoom?id=xyz
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const data = await callConvexFunction("getDiscussionRoom", "query", {
      id,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Convex query failed" },
      { status: 500 }
    );
  }
}

// POST: /api/discussionRoom
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { coachingOption, topic, expertName } = body;

  if (!coachingOption || !topic || !expertName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const result = await callConvexFunction("CreateNewRoom", "mutation", {
      coachingOption,
      topic,
      expertName,
    });

    return NextResponse.json({ id: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Convex mutation failed" },
      { status: 500 }
    );
  }
}
