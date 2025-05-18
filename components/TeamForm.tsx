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
}: competition) => {
  const [teamMembersCount, setTeamMembersCount] = useState<number>(1);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted");
    if (teamMembersCount === 3) {
      try {
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
          // Create team members array with subjects (excluding leader)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Leader Section with improved styling */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
            Team Leader Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  <FormLabel className="font-medium text-gray-700">
                    School
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  <FormLabel className="font-medium text-gray-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter phone number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel className="font-medium text-gray-700">
                    WhatsApp Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter WhatsApp number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Add Subject selection for team leader */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-medium text-gray-700">Your Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-700">
              Team Members
            </h2>
            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={() => setTeamMembersCount((i) => i + 1)}
                disabled={teamMembersCount === 3}
                className={`px-4 py-2 text-white rounded-md font-medium flex items-center gap-2 ${
                  teamMembersCount === 3
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
                }`}
              >
                {teamMembersCount === 3 ? "Maximum Reached" : "Add Member"}
              </Button>
            </div>
          </div>

          {/* Horizontal team members layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
            {Array.from({
              length: teamMembersCount,
            }).map((_, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-md font-medium mb-3 text-gray-700 border-b pb-2">
                  Member {index + 1}
                </h3>
                <FormField
                  control={form.control}
                  name={`teamMembers.${index}.email`}
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-sm text-gray-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="text-sm border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      <FormLabel>Subject</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject." />
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
            ))}
          </div>
        </div>

        <Button type="submit" onClick={() => form.handleSubmit(onSubmit)}>
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default TeamForm;