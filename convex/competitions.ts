import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const insertCompetition = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        isTeam: v.boolean(),
        startTime: v.number(),
        endTime: v.number(),
    },
    handler: async (
        ctx,
        { name, description, isTeam, startTime, endTime }
    ) => {
        await ctx.db.insert("competitions", {
            name,
            description,
            isTeam,
            startTime,
            endTime,
            isOpened: false,
        });
    },
});

export const getCompetitions = query({
    handler: async (ctx) => {
        return await ctx.db.query("competitions").collect();
    },
});

export const getCompetitionById = query({
    args: { competitionId: v.id("competitions") },
    handler: async (ctx, { competitionId }) => {
        return await ctx.db.get(competitionId);
    },
});
