import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const insertIntra = mutation({
  args: {
    userId: v.string(),
    fullName: v.string(),
    admissionNumber: v.number(),
    grade: v.number(),
    cls: v.string(),
    whatsAppNumber: v.number(),
    competitionId: v.id("competitions"),
    projectLink: v.optional(v.string()),
    subjectMarks: v.optional(
      v.array(
        v.object({
          subject: v.string(),
          marks: v.number(),
          time: v.number(),
        }),
      ),
    ),
  },
  handler: async (
    ctx,
    {
      userId,
      fullName,
      admissionNumber,
      grade,
      cls,
      whatsAppNumber,
      competitionId,
      projectLink,
      subjectMarks,
    },
  ) => {
    const getIntra = await ctx.db
      .query("intra")
      .filter((q) => q.eq(q.field("competitionId"), competitionId))
      .filter((q) => q.eq(q.field("admissionNumber"), admissionNumber))
      .first();
    if (!getIntra) {
      await ctx.db.insert("intra", {
        userId,
        fullName,
        admissionNumber,
        grade,
        cls,
        whatsAppNumber,
        competitionId,
        projectLink,
        subjectMarks,
      });
    } else {
    }
  },
});

export const patchIntra = mutation({
  args: {
    userId: v.string(),
    competitionId: v.id("competitions"),
    projectLink: v.optional(v.string()),
    subjectMarks: v.optional(
      v.array(
        v.object({
          subject: v.string(),
          marks: v.number(),
          time: v.number(),
        }),
      ),
    ),
  },
  handler: async (
    ctx,
    { userId, competitionId, projectLink, subjectMarks },
  ) => {
    const intra = await ctx.db
      .query("intra")
      .filter((q) => q.eq(q.field("competitionId"), competitionId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (intra) {
      await ctx.db.patch(intra._id, {
        projectLink,
        subjectMarks,
      });
    }
  },
});

export const getIntra = query({
  handler: async (ctx) => {
    return await ctx.db.query("intra").collect();
  },
});
