import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all posts
export const getPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

// Check if user has already voted for a specific post
export const hasUserVotedForPost = query({
  args: { voterId: v.string(), postId: v.id("posts") },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("voters")
      .withIndex("by_voter_post", (q) => 
        q.eq("voterId", args.voterId).eq("postId", args.postId)
      )
      .first();
    return !!vote;
  },
});

// Get all posts user has voted for
export const getUserVotedPosts = query({
  args: { voterId: v.string() },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("voters")
      .withIndex("by_voter", (q) => q.eq("voterId", args.voterId))
      .collect();
    return votes.map(vote => vote.postId);
  },
});

// Get voting results (top posts)
export const getVotingResults = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    const totalVotes = posts.reduce((sum, post) => sum + post.votes, 0);
    
    return posts
      .map(post => ({
        ...post,
        percentage: totalVotes > 0 ? (post.votes / totalVotes) * 100 : 0
      }))
      .sort((a, b) => b.votes - a.votes);
  },
});

// Vote for a post
export const voteForPost = mutation({
  args: { 
    postId: v.id("posts"), 
    voterId: v.string(),
    ipAddress: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check if user already voted for this specific post
    const existingVote = await ctx.db
      .query("voters")
      .withIndex("by_voter_post", (q) => 
        q.eq("voterId", args.voterId).eq("postId", args.postId)
      )
      .first();
    
    if (existingVote) {
      throw new Error("You have already voted for this post!");
    }
    
    // Check if post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found!");
    }
    
    // Record the vote
    await ctx.db.insert("voters", {
      voterId: args.voterId,
      postId: args.postId,
      votedAt: Date.now(),
      ipAddress: args.ipAddress,
    });
    
    // Increment post vote count
    await ctx.db.patch(args.postId, {
      votes: post.votes + 1,
    });
    
    return { success: true };
  },
});

// // Initialize sample posts (run once)
// export const initializePosts = mutation({
//   handler: async (ctx) => {
//     const existingPosts = await ctx.db.query("posts").collect();
//     if (existingPosts.length > 0) {
//       return { message: "Posts already exist" };
//     }
    
//     const samplePosts = [
//       {
//         title: "Digital Art Masterpiece",
//         description: "A stunning blend of modern digital techniques with classical art elements. This piece explores the intersection of technology and traditional artistic expression through vibrant colors and dynamic composition.",
//         imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1080&h=1350&fit=crop",
//         designedBy: "Sarah Chen",
//         school: "Central High School",
//         grade: "Grade 12",
//         votes: 0,
//         createdAt: Date.now(),
//       },
//       {
//         title: "Nature's Symphony",
//         description: "An environmental awareness poster featuring hand-drawn illustrations combined with digital effects. The artwork emphasizes the beauty of nature and our responsibility to protect it for future generations.",
//         imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&h=1350&fit=crop",
//         designedBy: "Marcus Johnson",
//         school: "Green Valley Academy",
//         grade: "Grade 11",
//         votes: 0,
//         createdAt: Date.now() - 1000,
//       },
//       {
//         title: "Urban Dreams",
//         description: "A contemporary urban landscape showcasing the energy and movement of city life. This mixed-media artwork combines photography, illustration, and typography to create a dynamic visual narrative.",
//         imageUrl: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=1080&h=1350&fit=crop",
//         designedBy: "Elena Rodriguez",
//         school: "Riverside International School",
//         grade: "Grade 10",
//         votes: 0,
//         createdAt: Date.now() - 2000,
//       },
//       {
//         title: "Cultural Heritage",
//         description: "A tribute to cultural diversity and heritage, featuring traditional patterns and symbols reimagined through modern design principles. This piece celebrates the rich tapestry of human culture and history.",
//         imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1080&h=1350&fit=crop",
//         designedBy: "Aiden Kim",
//         school: "Oakwood Preparatory",
//         grade: "Grade 12",
//         votes: 0,
//         createdAt: Date.now() - 3000,
//       },
//       {
//         title: "Future Vision",
//         description: "A futuristic concept design exploring themes of innovation, technology, and human potential. Using bold geometric shapes and metallic textures to create a vision of tomorrow's possibilities.",
//         imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1080&h=1350&fit=crop",
//         designedBy: "Zoe Williams",
//         school: "Tech Innovation High",
//         grade: "Grade 11",
//         votes: 0,
//         createdAt: Date.now() - 4000,
//       },
//       {
//         title: "Ocean Conservation",
//         description: "An impactful environmental poster raising awareness about ocean pollution and marine life conservation. Features underwater photography combined with powerful messaging and creative typography.",
//         imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1080&h=1350&fit=crop",
//         designedBy: "Liam Thompson",
//         school: "Coastal Arts Academy",
//         grade: "Grade 9",
//         votes: 0,
//         createdAt: Date.now() - 5000,
//       }
//     ];
    
//     for (const post of samplePosts) {
//       await ctx.db.insert("posts", post);
//     }
    
//     return { message: "Posts initialized successfully" };
//   },
// });