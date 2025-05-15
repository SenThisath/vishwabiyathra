import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    userId: v.string(),
    school: v.optional(v.string()),
    role: v.union(v.literal("competitor"), v.literal("teacher")),
    phoneNumber: v.optional(v.number()),
    whatsappNumber: v.optional(v.number()),
  }),
  competitions: defineTable({
    name: v.string(),
    description: v.string(),
    img: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    isOpened: v.boolean(),
    isTeam: v.boolean(),
  }),
  reservations: defineTable({
    competitionId: v.id("competitions"),
    teamLeader: v.string(),
    teamMembers: v.optional(
      v.array(v.object({ user: v.string(), subject: v.string() })),
    ),
  }),
  intra: defineTable({
    fullName: v.string(),
    admissionNumber: v.number(),
    grade: v.number(),
    class: v.string(),
    whatsAppNumber: v.number(),
    subject: v.string(),
    marks: v.string(),
    time: v.number(),
  }),
  quizzes: defineTable({
    teacherId: v.string(),
    subject: v.optional(v.string()),
    quizzes: v.optional(
      v.array(
        v.object({
          quiz: v.string(),
          image: v.optional(v.string()),
          answers: v.array(
            v.object({ answer: v.string(), isCorrect: v.boolean() }),
          ),
        }),
      ),
    ),
  }),
  meetings: defineTable({
    competitionId: v.id("competitions"),
    link: v.string(),
    isJoined: v.optional(
      v.array(v.object({ user: v.string(), status: v.boolean() })),
    ),
  }),
});
