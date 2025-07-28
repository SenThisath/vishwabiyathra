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
  handler: async (ctx, { name, description, isTeam, startTime, endTime }) => {
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

export const getInterRegistrations = query({
  handler: async (ctx) => {
    return await ctx.db.query("reservations").collect();
  },
});

// Get inter registrations by competition ID
export const getInterRegistrationsByCompetition = query({
  args: { competitionId: v.id("competitions") },
  handler: async (ctx, { competitionId }) => {
    return await ctx.db
      .query("reservations")
      .filter((q) => q.eq(q.field("competitionId"), competitionId))
      .collect();
  },
});

// Get all intra registrations (individual-based)
export const getIntraRegistrations = query({
  handler: async (ctx) => {
    return await ctx.db.query("intra").collect();
  },
});

// Get intra registrations by competition ID
export const getIntraRegistrationsByCompetition = query({
  args: { competitionId: v.id("competitions") },
  handler: async (ctx, { competitionId }) => {
    return await ctx.db
      .query("intra")
      .filter((q) => q.eq(q.field("competitionId"), competitionId))
      .collect();
  },
});

export const getRegistrationsWithCompetitionDetails = query({
  handler: async (ctx) => {
    const competitions = await ctx.db.query("competitions").collect();
    const reservations = await ctx.db.query("reservations").collect();
    const interRegs = await ctx.db.query("inter").collect();
    const intraRegs = await ctx.db.query("intra").collect();
    const users = await ctx.db.query("users").collect();

    const competitionMap = new Map(competitions.map((comp) => [comp._id, comp]));
    const userMap = new Map(users.map((user) => [user.userId, user]));

    // Show all reservations for inter competitions, with or without inter submissions
    const interWithDetails = reservations
      .filter((res) => {
        const comp = competitionMap.get(res.competitionId);
        return comp?.isInterOpen;
      })
      .map((reservation) => {
        const competition = competitionMap.get(reservation.competitionId);
        const inter = interRegs.find((i) => i.reservationId === reservation._id);
        const teamLeader = userMap.get(reservation.teamLeader);

        return {
          ...inter, // may be undefined
          type: "inter" as const,
          reservation,
          competition: competition || null,
          teamLeader: teamLeader || null,
          competitionName: competition?.name || "Unknown",
          competitionDescription: competition?.description || "",
          teamMembers: reservation.teamMembers || [],
        };
      });

    // Intra registrations don't use reservations
    const intraWithDetails = intraRegs.map((intra) => {
      const competition = competitionMap.get(intra.competitionId);

      return {
        ...intra,
        type: "intra" as const,
        competition: competition || null,
        competitionName: competition?.name || "Unknown",
        competitionDescription: competition?.description || "",
      };
    });

    return {
      inter: interWithDetails,
      intra: intraWithDetails,
    };
  },
});


// Add deletion mutations
export const deleteInterRegistration = mutation({
  args: { registrationId: v.id("reservations") },
  handler: async (ctx, { registrationId }) => {
    // Delete the matching inter submission if exists
    const interEntry = await ctx.db
      .query("inter")
      .withIndex("by_reservationId") // Make sure this index exists!
      .filter((q) => q.eq(q.field("reservationId"), registrationId))
      .unique();

    if (interEntry) {
      await ctx.db.delete(interEntry._id);
    }

    // Then delete the reservation
    await ctx.db.delete(registrationId);
  },
});

export const deleteIntraRegistration = mutation({
  args: { registrationId: v.id("intra") },
  handler: async (ctx, { registrationId }) => {
    await ctx.db.delete(registrationId);
  },
});

// Add update mutations
export const updateInterRegistration = mutation({
  args: {
    registrationId: v.id("reservations"),
    teamLeader: v.string(),
    teamMembers: v.optional(
      v.array(v.object({ user: v.string(), subject: v.string() })),
    ),
  },
  handler: async (ctx, { registrationId, teamLeader, teamMembers }) => {
    await ctx.db.patch(registrationId, {
      teamLeader,
      teamMembers,
    });
  },
});

export const updateIntraRegistration = mutation({
  args: {
    registrationId: v.id("intra"),
    fullName: v.string(),
    admissionNumber: v.number(),
    grade: v.number(),
    cls: v.string(),
    whatsAppNumber: v.number(),
  },
  handler: async (
    ctx,
    { registrationId, fullName, admissionNumber, grade, cls, whatsAppNumber },
  ) => {
    await ctx.db.patch(registrationId, {
      fullName,
      admissionNumber,
      grade,
      cls,
      whatsAppNumber,
    });
  },
});
