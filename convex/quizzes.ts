import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveSubjectOfTeacher = mutation({
    args: { teacherId: v.string(), subject: v.string() },
    handler: async (ctx, { teacherId, subject }) => {
        const teacher = await ctx.db
            .query("quizzes")
            .filter((q) => q.eq(q.field("teacherId"), teacherId))
            .first();
        if (!teacher) await ctx.db.insert("quizzes", { teacherId, subject });
    },
});

export const getSelectedSubjectOfTeacher = query({
    args: { teacherId: v.string() },
    handler: async (ctx, { teacherId }) => {
        const teacher = await ctx.db
            .query("quizzes")
            .filter((q) => q.eq(q.field("teacherId"), teacherId))
            .first();
        if (teacher) return teacher.subject;
    },
});

export const saveQuizzes = mutation({
    args: {
        teacherId: v.string(),
        subject: v.string(),
        quizzes: v.array(
            v.object({
                quiz: v.string(),
                image: v.optional(v.string()),
                answers: v.array(
                    v.object({ answer: v.string(), isCorrect: v.boolean() })
                ),
            })
        ),
    },
    handler: async (ctx, { teacherId, subject, quizzes }) => {
        const teacher = await ctx.db
            .query("quizzes")
            .filter((q) => q.eq(q.field("teacherId"), teacherId))
            .filter((q) => q.eq(q.field("subject"), subject))
            .first();
        if (teacher) await ctx.db.patch(teacher._id, { quizzes });
    },
});

export const getPreviousSavedQuestions = query({
    args: { teacherId: v.string(), subject: v.string() },
    handler: async (ctx, { teacherId, subject }) => {
        const teacher = await ctx.db
            .query("quizzes")
            .filter((q) => q.eq(q.field("teacherId"), teacherId))
            .filter((q) => q.eq(q.field("subject"), subject))
            .first();
        if (teacher) return teacher.quizzes;
    },
});

export const getQuizzesBySubject = query({
    args: { subject: v.string() },
    handler: async (ctx, { subject }) => {
        return await ctx.db
            .query("quizzes")
            .filter((q) => q.eq(q.field("subject"), subject))
            .first();
    },
});

export const getAllQuizzes = query({
  handler: async (ctx) => {
    // Query all quiz documents
    const quizzes = await ctx.db.query("quizzes").collect();
    
    // Return all quizzes
    return quizzes;
  },
});