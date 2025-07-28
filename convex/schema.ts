import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    userId: v.string(),
    school: v.optional(v.string()),
    role: v.union(v.literal("competitor"), v.literal("teacher")),
    grade: v.number(),
    phoneNumber: v.optional(v.number()),
    whatsappNumber: v.optional(v.number()),
  }),
  competitions: defineTable({
    name: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    isOpened: v.boolean(),
    isTeam: v.boolean(),
    rules: v.optional(v.string()),
    isInterOpen: v.optional(v.boolean()),
    inIntraOpen: v.optional(v.boolean()),
    whatsappGroupLink: v.optional(v.string())
  }),
  reservations: defineTable({
    competitionId: v.id("competitions"),
    teamLeader: v.string(),
    teamMembers: v.optional(
      v.array(v.object({ user: v.string(), subject: v.string() })),
    ),
  }),
  inter: defineTable({
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
  }).index("by_reservationId", ["reservationId"]),
  intra: defineTable({
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
  }),
  quizzes: defineTable({
    teacherId: v.string(),
    subject: v.optional(v.string()),
    quizzes: v.optional(
      v.array(
        v.object({
          quizType: v.string(),
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
  posts: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    designedBy: v.string(),
    school: v.string(),
    grade: v.string(),
    votes: v.number(),
    createdAt: v.number(),
  }),

  voters: defineTable({
    voterId: v.string(), // Could be user ID, email, or unique identifier
    postId: v.id("posts"),
    votedAt: v.number(),
    ipAddress: v.optional(v.string()),
  })
    .index("by_voter", ["voterId"])
    .index("by_post", ["postId"])
    .index("by_voter_post", ["voterId", "postId"]),
});
