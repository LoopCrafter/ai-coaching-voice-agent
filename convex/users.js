import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    //if user is already exist
    const userData = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    // if not then add new user
    if (userData?.length === 0) {
      const data = {
        name: args.name,
        email: args.email,
        credit: 50000,
        avatar: args.avatar,
      };

      await ctx.db.insert("users", {
        ...data,
      });
      return data;
    }

    return userData[0];
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return users.length > 0 ? users[0] : null;
  },
});

export const updateUserToken = mutation({
  args: {
    id: v.id("users"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      credit: args.credits,
    });
  },
});
