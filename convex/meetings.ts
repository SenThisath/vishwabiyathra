import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveMeeting = mutation({
  args: {
    competitionId: v.id("competitions"),
    link: v.string(),
  },
  handler: async (ctx, { competitionId, link }) => {
    await ctx.db.insert("meetings", { competitionId, link });
  },
});

export const saveAttendance = mutation({
  args: {
    meeting: v.id("meetings"),
    isJoined: v.array(v.object({ user: v.string(), status: v.boolean() })),
  },
  handler: async (ctx, { meeting, isJoined }) => {
    const reservation = await ctx.db
      .query("meetings")
      .filter((q) => q.eq(q.field("_id"), meeting))
      .first();
    if (reservation) {
      ctx.db.patch(meeting, { isJoined });
    }
  },
});

export const getAttendance = query({
  args: { competitionId: v.id("competitions") },
  handler: async (ctx, { competitionId }) => {
    return await ctx.db
      .query("meetings")
      .filter((q) => q.eq(q.field("competitionId"), competitionId))
      .first();
  },
});
