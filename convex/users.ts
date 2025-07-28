import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    userId: v.string(),
    grade: v.number(),
    role: v.union(v.literal("competitor"), v.literal("teacher")),
  },
  handler: async (ctx, { name, email, userId, grade, role }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!user)
      await ctx.db.insert("users", { name, email, userId, grade, role });
  },
});

export const getUserDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
  },
});

export const checkDetailsSaved = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (user) {
      if (user.school === undefined || user.phoneNumber === undefined)
        return true;
    }
  },
});

export const saveOtherDetails = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    school: v.string(),
    grade: v.number(),
    phoneNumber: v.number(),
    whatsappNumber: v.number(),
  },
  handler: async (
    ctx,
    { userId, name, school, grade, phoneNumber, whatsappNumber },
  ) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (user) {
      await ctx.db.patch(user._id, {
        name,
        school,
        grade,
        phoneNumber,
        whatsappNumber,
      });
    }
  },
});

export const fetchedUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
