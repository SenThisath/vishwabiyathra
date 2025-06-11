"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { createUser } from "@/actions/createUser";
import { getUserByEmail } from "@/actions/getUserByEmail";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { subjects } from "../components/SubjectSelection";
import { toast } from "sonner";

interface competition {
  _id: Id<"competitions">;
  _creationTime: number;
  name: string;
  description: string;
  img: string;
  startTime: number;
  endTime: number;
  isOpened: boolean;
  isTeam: boolean;
}

const TeamForm = ({
  _id,
  isTeam,
  setModelOpen,
}: competition & { setModelOpen: (open: boolean) => void }) => {
  const [teamMembersCount] = useState<number>(3);

  const insertReservation = useMutation(api.reservations.insertReservation);
  const { user } = useUser();
  const getUserDetails = useQuery(
    api.users.getUserDetails,
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
    // Add subject field for team leader
    subject: z.string({
      required_error: "Subject must be selected.",
    }),
    teamMembers: z.array(
      z.object({
        email: z
          .string()
          .min(1, { message: "This field has to be filled." })
          .email("This is not a valid email."),
        subject: z.string({
          required_error: "Subject must be selected.",
        }),
      }),
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      school: undefined,
      phoneNumber: undefined,
      whatsappNumber: undefined,
      subject: undefined, // Add default value for team leader subject
      teamMembers: [{ email: undefined, subject: undefined }],
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (teamMembersCount === 3) {
      try {
        setModelOpen(false);
        setLoading(true);
        const toastId = toast.loading("Users are creating...", {
          duration: Infinity,
          className: "bg-yellow-500 text-white",
          style: {
            borderColor: "#eab308",
            color: "white",
            fontSize: "18px",
            backgroundColor: "#fbbf24",
            borderWidth: "2px",
          },
        });
        const createdAccounts = await Promise.all(
          values.teamMembers?.map(async (member) => {
            const createdAccount = await createUser(member.email, "competitor");
            if (createdAccount.error) {
              const existingUser = await getUserByEmail(member.email);
              return existingUser?.userId ?? null;
            }
            return createdAccount.userId;
          }),
        );
        console.log("Raw createdAccounts:", createdAccounts);
        if (createdAccounts.length === 3 && user) {
          const teamMembersWithSubjects = createdAccounts.map(
            (userId, index) => ({
              user: userId!.toString(), // Non-null assertion
              subject: values.teamMembers[index].subject,
            }),
          );

          // Add team leader to the array with their subject
          const allTeamMembers = [
            {
              user: user.id,
              subject: values.subject,
            },
            ...teamMembersWithSubjects,
          ];

          console.log("All team members:", allTeamMembers);
          insertReservation({
            competitionId: _id,
            teamLeader: user.id,
            teamMembers: allTeamMembers,
          });
          setModelOpen(false);
          setLoading(false);
          toast.dismiss(toastId);
          toast("User Creation Done...", {
            style: {
              color: "white",
              fontSize: "18px",
              borderColor: "#22c55e",
              backgroundColor: "#4ade80",
              borderWidth: "2px",
            },
          });
        } else {
          console.log("Some users were not created or found successfully.");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please fill all team members.");
    }
    console.log(isTeam);
  }

  useEffect(() => {
    if (getUserDetails) {
      form.reset({
        name: getUserDetails.name,
        school: getUserDetails.school,
        phoneNumber: getUserDetails.phoneNumber,
        whatsappNumber: getUserDetails.whatsappNumber,
      });
    }
  }, [getUserDetails, form]);

  return (
    <Form {...form}>
      {!loading && (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[90vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Leader Section with improved styling */}
            <div className="bg-black border border-gray-100 rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-semibold bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
            bg-clip-text text-transparent border-b pb-2"
                >
                  Team Leader Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-white">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter your full name"
                        />
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
                      <FormLabel className="font-medium text-white">
                        School
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter school name"
                        />
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
                      <FormLabel className="font-medium text-white">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          className="bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter phone number"
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
                      <FormLabel className="font-medium text-white">
                        WhatsApp Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          className="bg-white text-gray-800 placeholder:italic placeholder:text-gray-500 rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Enter WhatsApp number"
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-medium text-white">
                        Your Subject
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <SelectValue placeholder="Select your subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.name} value={subject.name}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Team Members Section with horizontal layout */}
            <div className="bg-black border border-gray-100 rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-semibold bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
            bg-clip-text text-transparent border-b pb-2"
                >
                  Team Members
                </h2>
              </div>

              {/* Horizontal team members layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
                {Array.from({
                  length: teamMembersCount,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-black border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-md font-medium mb-3 text-white border-b pb-2">
                      Member {index + 1}
                    </h3>
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="mb-3">
                          <FormLabel className="text-sm text-white">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white text-gray-800 placeholder:italic placeholder:text-gray-500 rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                              placeholder="Enter email"
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.subject`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select a subject." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem
                                  key={subject.name}
                                  value={subject.name}
                                >
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              onClick={() => form.handleSubmit(onSubmit)}
              className="uppercase font-bold text-white px-6 py-2 rounded-full border-2 border-pink-500 mt-5"
            >
              Save changes
            </Button>
          </div>

        </form>
      )}
    </Form>
  );
};

export default TeamForm;
