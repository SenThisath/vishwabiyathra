import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const insertInter = mutation({
  args: {
    reservationId: v.id("reservations"),
    projectLink: v.optional(v.string()),
    teamMarks: v.optional(
      v.array(
        v.object({
          user: v.string(),
          subject: v.string(),
          marks: v.number(),
          time: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, { reservationId, projectLink, teamMarks }) => {
    const getInter = await ctx.db
      .query("inter")
      .filter((q) => q.eq(q.field("reservationId"), reservationId))
      .first();
    if (!getInter) {
      await ctx.db.insert("inter", {
        reservationId,
        projectLink,
        teamMarks,
      });
    }
  },
});

export const patchInter = mutation({
  args: {
    reservationId: v.id("reservations"),
    projectLink: v.optional(v.string()),
    teamMarks: v.optional(
      v.array(
        v.object({
          user: v.string(),
          subject: v.string(),
          marks: v.number(),
          time: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, { reservationId, projectLink, teamMarks }) => {
    const getInter = await ctx.db
      .query("inter")
      .filter((q) => q.eq(q.field("reservationId"), reservationId))
      .first();
    if (getInter) {
      await ctx.db.patch(getInter._id, { projectLink, teamMarks });
    }
  },
});

export const getInter = query({
  handler: async (ctx) => {
    return await ctx.db.query("inter").collect();
  },
});
