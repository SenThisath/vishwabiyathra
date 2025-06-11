"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const getVoterId = () => {
  if (typeof window !== "undefined") {
    let voterId = localStorage.getItem("voterId");
    if (!voterId) {
      voterId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("voterId", voterId);
    }
    return voterId;
  }
  return "";
};

const Voting = () => {
  const [voterId, setVoterId] = useState("");
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());

  const posts = useQuery(api.posts.getPosts);
  const userVotedPosts = useQuery(
    api.posts.getUserVotedPosts,
    voterId ? { voterId } : "skip",
  );
  const voteForPost = useMutation(api.posts.voteForPost);

  useEffect(() => {
    setVoterId(getVoterId());
  }, []);

  // Update voted posts when user data loads
  useEffect(() => {
    if (userVotedPosts) {
      setVotedPosts(new Set(userVotedPosts));
    }
  }, [userVotedPosts]);

  const handleVote = async (postId: Id<"posts">) => {
    if (votedPosts.has(postId)) {
      toast.warning("You have already voted for this post!", {
        style: {
          color: "white",
          fontSize: "18px",
          borderColor: "#eab308",
          backgroundColor: "#facc15",
          borderWidth: "2px",
        },
      });
      return;
    }

    try {
      await voteForPost({
        postId,
        voterId,
        ipAddress: "client-ip",
      });

      setVotedPosts((prev) => new Set([...prev, postId]));
      toast("Vote recorded! Thanks for participating.", {
        style: {
          color: "white",
          fontSize: "18px",
          borderColor: "#22c55e",
          backgroundColor: "#4ade80",
          borderWidth: "2px",
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.", {
        style: {
          color: "white",
          fontSize: "18px",
          borderColor: "#dc2626",
          backgroundColor: "#ef4444",
          borderWidth: "2px",
        },
      });
    }
  };

  const getPostVoteStatus = (postId: string) => {
    return votedPosts.has(postId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <section
        id="competitions"
        className="min-h-screen py-8 md:py-16 lg:py-24 relative z-0 flex flex-col items-center justify-center"
      >
        <div className="z-10 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto text-center">
          <FadeInWhenVisible>
            <div className="flex flex-col items-center">
              <Title mainText="THE FUTURE OF" subText="TABLETOP IS HERE" />
            </div>
          </FadeInWhenVisible>

          <div className="mt-8 md:mt-12 lg:mt-16 max-w-7xl mx-auto">
            {posts && posts.length === 0 ? (
              <div className="bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)] backdrop-blur-sm comicFont">
                <div className="min-h-[50vh] flex flex-col items-center justify-center bg-black text-white text-center px-4 py-10">
                  <motion.h2
                    className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    Memes is on the way...
                  </motion.h2>

                  <motion.p
                    className="mt-6 text-lg text-gray-400/80 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  >
                    Get ready to see which schools are leading the competition!
                  </motion.p>

                  <div className="flex space-x-2 mt-8">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-4 h-4 bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {posts &&
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-black rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="relative group cursor-pointer">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-contain transition-transform duration-300"
                          style={{
                          aspectRatio: "1080/1350",
                          minHeight: "400px"
                          }}
                        />
                        <div className="flex gap-2 absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-bold">
                          {post.votes} <Heart size={20} />
                        </div>
                        </div>

                      <div className="p-4">
                        <h3
                          className="font-extrabold tracking-wide bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent mb-2 line-clamp-2"
                        >
                          {post.title}
                        </h3>

                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p className="flex items-center">
                            <span className="font-medium">By:</span>
                            <span className="ml-2 font-medium">
                              {post.designedBy}
                            </span>
                          </p>
                          <p className="flex items-center">
                            <span className="font-medium">School:</span>
                            <span className="ml-2">{post.school}</span>
                          </p>
                          <p className="flex items-center">
                            <span className="font-medium">Grade:</span>
                            <span className="ml-2">{post.grade}</span>
                          </p>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                          {post.description}
                        </p>

                        <Button
                          onClick={() => handleVote(post._id)}
                          className={`rounded-full border-2 font-bold text-lg uppercase ${
                            getPostVoteStatus(post._id)
                              ? "bg-green-700 text-white cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          }`}
                        >
                          {getPostVoteStatus(post._id) ? "Voted" : "Vote"}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* {showResults ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">🏆 Competition Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results?.map((post, index) => (
                <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                      style={{ aspectRatio: '1080/1350' }}
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full font-bold">
                      #{index + 1}
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full font-bold">
                      {post.votes} votes
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>👨‍🎨 <strong>By:</strong> {post.designedBy}</p>
                      <p>🏫 <strong>School:</strong> {post.school}</p>
                      <p>📚 <strong>Grade:</strong> {post.grade}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${post.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-sm font-medium text-purple-600">
                      {post.percentage.toFixed(1)}% of total votes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (

        )} */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Voting;
