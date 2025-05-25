import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom = mutation({
  args: {
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { coachingOption, topic, expertName, uid } = args;
    const results = await ctx.db.insert("DiscussionRoom", {
      coachingOption,
      topic,
      expertName,
      uid,
    });

    return results;
  },
});

export const getDiscussionRoom = query({
  args: {
    id: v.id("DiscussionRoom"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    return result;
  },
});

export const updateConversation = mutation({
  args: { id: v.id("DiscussionRoom"), conversation: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      conversation: args.conversation,
    });
  },
});

export const updateSummary = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    feedback: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      summary: args.feedback,
    });
  },
});

export const getDiscussionsHistory = query({
  args: { uid: v.id("users") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("DiscussionRoom")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .order("desc")
      .collect();

    return results;
  },
});
