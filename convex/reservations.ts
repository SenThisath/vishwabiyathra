import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const insertReservation = mutation({
    args: {
        competitionId: v.id("competitions"),
        teamLeader: v.string(),
        teamMembers: v.optional(
            v.array(v.object({ user: v.string(), subject: v.string() }))
        ),
    },
    handler: async (ctx, { competitionId, teamLeader, teamMembers }) => {
        const reservation = await ctx.db
            .query("reservations")
            .filter((q) => q.eq(q.field("competitionId"), competitionId))
            .filter((q) => q.eq(q.field("teamLeader"), teamLeader))
            .first();

        if (!reservation) {
            await ctx.db.insert("reservations", {
                competitionId,
                teamLeader,
                teamMembers,
            });
        }
    },
});

export const getReservations = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("reservations").collect();
    },
});
