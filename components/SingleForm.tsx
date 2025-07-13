"use client";

import { Id } from "@/convex/_generated/dataModel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

interface competition {
  _id: Id<"competitions">;
  _creationTime: number;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  isOpened: boolean;
  isTeam: boolean;
}

const SingleForm = ({ _id, isTeam }: competition) => {
  const { user } = useUser();
  const getUserDetails = useQuery(
    api.users.getUserDetails,
    user ? { userId: user.id } : "skip",
  );
  const insertReservation = useMutation(api.reservations.insertReservation);

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
  async function onSubmit() {
    if (!isTeam && user) {
      insertReservation({
        competitionId: _id,
        teamLeader: user.id,
      });
    }
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white placeholder:italic" />
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
                <Input {...field} className="bg-white placeholder:italic" />
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
              <FormLabel className="text-white ">Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-white placeholder:italic"
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
              <FormLabel className="text-white">WhatsApp Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-white placeholder:italic"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="uppercase font-bold text-white px-6 py-2 rounded-full border-2 border-pink-500 hover:bg-pink-500 transition-colors duration-200 mt-5"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default SingleForm;
