import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom = mutation({
  args: {
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
  },
  handler: async (ctx, args) => {
    const { coachingOption, topic, expertName } = args;
    const results = await ctx.db.insert("DiscussionRoom", {
      coachingOption,
      topic,
      expertName,
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
