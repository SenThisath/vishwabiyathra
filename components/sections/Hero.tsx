"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Roles } from "@/types/globals";

export default function Hero() {
  const containerRef = useRef(null);
  const { user } = useUser();

  const role = user ? (user.publicMetadata.role as Roles) : undefined;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const checkOtherDetails = useQuery(
    api.users.checkDetailsSaved,
    user ? { userId: user.id } : "skip",
  );

  const formSchema = z.object({
    name: z.string({ required_error: "Please enter your school name." }),
    school: z.string({ required_error: "Please enter your school name." }),
    phoneNumber: z.number({
      required_error: "Please enter a phone number.",
    }),
    whatsappNumber: z.number({
      required_error: "Please enter a phone number.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      school: undefined,
      phoneNumber: undefined,
      whatsappNumber: undefined,
    },
  });

  const saveOtherDetails = useMutation(api.users.saveOtherDetails);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (user) {
      const newValues = { ...values, userId: user.id };
      saveOtherDetails(newValues);
    }
  }

  return (
    <div className="flex flex-col bg-black">
      <main
        className={`overflow-x-hidden ${checkOtherDetails ? "blur-sm" : ""}`}
        ref={containerRef}
      >
        {checkOtherDetails && role && role === "competitor" && (
          <Dialog open={checkOtherDetails}>
            <DialogContent className="sm:max-w-[425px] bg-black">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                  Please Fill the Details To Continue.
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">School</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          WhatsApp Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="uppercase font-bold text-white px-6 py-2 rounded-full border-2 border-pink-500 hover:bg-pink-500 transition-colors duration-200"
                  >
                    Save changes
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
        <motion.section
          style={{ y, opacity }}
          className="relative flex flex-col items-center justify-center py-23 px-4 sm:px-6 md:px-10"
        >
          <div className="text-center w-full max-w-4xl mx-auto">
            <FadeInWhenVisible direction="down" delay={0.1}>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-full h-[150px] sm:h-[150px] md:h-[200px] max-w-[350px] sm:max-w-[400px] md:max-w-[500px]">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    className="object-contain"
                    fill
                    sizes="(max-width: 640px) 350px, (max-width: 768px) 400px, 500px"
                    priority
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-3xl opacity-30 z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible direction="up" delay={0.1}>
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 max-w-3xl mx-auto font-extrabold uppercase bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                A Paradise Where Legends Are Born
              </h1>
            </FadeInWhenVisible>

            <FadeInWhenVisible direction="up" delay={0.4}>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100 px-4">
                <span className="relative">
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-0"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{
                      duration: 3,
                      delay: 1,
                      repeat: Infinity,
                    }}
                  />
                  <span className="relative comicFont">
                    Bandaranayake Collage Science Society <br /> proudly presents{" "}
                    <br /> Vishwabhiyathra`25`
                  </span>
                </span>
              </p>
            </FadeInWhenVisible>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
