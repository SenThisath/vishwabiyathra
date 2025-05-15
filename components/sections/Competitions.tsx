"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Title } from "../Title";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { useEffect, useState } from "react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { createUser } from "@/actions/createUser";
import Link from "next/link";
import { subjects } from "../SubjectSelection";
import { getUserByEmail } from "@/actions/getUserByEmail";

const Competitions = () => {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const competitions = useQuery(api.competitions.getCompetitions);
  const [isOneSlide, setIsOneSlide] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<{
    _id: Id<"competitions">;
    _creationTime: number;
    name: string;
    description: string;
    img: string;
    startTime: number;
    endTime: number;
    isOpened: boolean;
    isTeam: boolean;
  }>();
  const [teamMembersCount, setTeamMembersCount] = useState<number>(1);

  const { user } = useUser();

  const getUserDetails = useQuery(
    api.users.getUserDetails,
    user ? { userId: user.id } : "skip",
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (competitions && competitions.length === 1) {
      setIsOneSlide(true);
    } else {
      setIsOneSlide(false);
    }
  }, [competitions]);

  const formSchema = z.object({
    name: z.string({ required_error: "Please enter your school name." }),
    school: z.string({ required_error: "Please enter your school name." }),
    phoneNumber: z.number({
      required_error: "Please enter a phone number.",
    }),
    whatsappNumber: z.number({
      required_error: "Please enter a phone number.",
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
      teamMembers: [{ email: undefined, subject: undefined }],
    },
  });

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

  const insertReservation = useMutation(api.reservations.insertReservation);
  const getReservations = useQuery(api.reservations.getReservations);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("object");
    if (user && selectedCompetition) {
      if (selectedCompetition.isTeam) {
        if (teamMembersCount === 3) {
          try {
            const createdAccounts = await Promise.all(
              values.teamMembers?.map(async (member) => {
                const createdAccount = await createUser(
                  member.email,
                  "competitor",
                );
                if (createdAccount.error) {
                  const existingUser = await getUserByEmail(member.email);
                  return existingUser?.userId ?? null;
                }
                return createdAccount.userId;
              }),
            );
            console.log("Raw createdAccounts:", createdAccounts);
            if (createdAccounts.length === 3) {
              const teamMembersWithSubjects = createdAccounts.map(
                (userId, index) => ({
                  user: userId!.toString(), // Non-null assertion
                  subject: values.teamMembers[index].subject,
                }),
              );
              console.log("Team members:", teamMembersWithSubjects);
              insertReservation({
                competitionId: selectedCompetition._id,
                teamLeader: user.id,
                teamMembers: teamMembersWithSubjects,
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
        console.log(selectedCompetition.isTeam);
      } else {
        // insertReservation({
        //   competitionId: selectedCompetition._id,
        //   teamLeader: user.id,
        // });
        console.log(selectedCompetition.isTeam);
        console.log("hey");
      }
    }
  }
  const renderContent = (competition: {
    _id: Id<"competitions">;
    _creationTime: number;
    name: string;
    description: string;
    img: string;
    startTime: number;
    endTime: number;
    isOpened: boolean;
    isTeam: boolean;
  }) => {
    return (
      <div className="bg-gradient-to-b from-purple-900/50 to-black rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300">
        <div className="relative">
          <Image
            src={competition.img}
            alt={`Competition ${+1}`}
            width={800}
            height={400}
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {competition.name}
          </h3>
          <p className="text-gray-300 text-sm md:text-base mb-4">
            {competition.description}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className={`px-4 py-2 rounded-lg transition-colors duration-300 font-semibold
    ${
      competition.isOpened
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-gray-400 text-white cursor-not-allowed"
    } ${
      !!getReservations?.find((res) => res.competitionId === competition._id)
        ? "bg-green-100 text-green-700 border-green-300"
        : "bg-red-100 text-red-700 border-red-300"
    }`}
                disabled={
                  !competition.isOpened ||
                  !!!user ||
                  !!getReservations?.find(
                    (res) => res.competitionId === competition._id,
                  )
                }
                onClick={() => setSelectedCompetition(competition)}
              >
                {(() => {
                  const reservation = getReservations?.find(
                    (res) => res.competitionId === competition._id,
                  );

                  if (!user) {
                    return "Please Sign In To Continue.";
                  }

                  if (reservation) {
                    if (reservation.teamMembers) {
                      const isTeamMember = reservation.teamMembers.find(
                        (member) => member.user === user.id,
                      );
                      if (isTeamMember) {
                        return "You're a Team Member";
                      }
                    }
                    return "Registered";
                  }

                  return competition.isOpened
                    ? "Reserve Your Seat"
                    : "Coming Soon...!";
                })()}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register to {competition.name}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {competition.isTeam ? (
                    <>
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
                                <FormLabel className="font-medium text-gray-700">
                                  WhatsApp Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                              {teamMembersCount === 3
                                ? "Maximum Reached"
                                : "Add Member"}
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
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
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
                            <FormLabel>School</FormLabel>
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
                            <FormLabel>Phone Number</FormLabel>
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
                            <FormLabel>WhatsApp Number</FormLabel>
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
                    </>
                  )}
                  <Button
                    type="submit"
                    onClick={() => form.handleSubmit(onSubmit)}
                  >
                    Save changes
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {user &&
            getReservations?.find((res) => {
              if (res.competitionId === competition._id) {
                if (competition.isTeam) {
                  // Check if user is part of the team
                  return (
                    res.teamMembers?.some(
                      (member) => member.user === user.id,
                    ) || res.teamLeader === user.id
                  );
                }
                return true;
              }
              return false;
            }) &&
            (competition.isTeam ? (
              <Button asChild>
                <Link href={`/quiz/${competition._id}`} className="text-white">
                  Join Live
                </Link>
              </Button>
            ) : (
              <Button>Submit Your Work</Button>
            ))}

          {competition.isOpened &&
            competition.isTeam &&
            !getReservations?.some(
              (res) => res.competitionId === competition._id,
            ) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
                    Intra-School Competitor Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter Student Details</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = new FormData(e.currentTarget);
                      const name = form.get("studentName");
                      const admission = form.get("admissionNumber");
                      const grade = form.get("grade");
                      const whatsapp = form.get("whatsapp");

                      if (name && admission && grade && whatsapp) {
                        console.log(name);
                      } else {
                        alert("Please fill all fields.");
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Input name="studentName" placeholder="Enter full name" />
                    </div>
                    <div>
                      <Input
                        name="admissionNumber"
                        placeholder="Admission number"
                      />
                    </div>
                    <div>
                      <Input name="grade" placeholder="Grade" />
                    </div>
                    <div>
                      <Input name="whatsapp" placeholder="WhatsApp number" />
                    </div>
                    <Button type="submit" className="w-full">
                      Start Quiz
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
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

          <div className="mt-8 md:mt-12 lg:mt-16">
            <FadeInWhenVisible delay={0.2}>
              {isOneSlide ? (
                <div className="max-w-md mx-auto mb-10">
                  {competitions &&
                    competitions.length > 0 &&
                    renderContent(competitions[0])}
                </div>
              ) : (
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={slidesPerView}
                  spaceBetween={20}
                  loop={competitions && competitions.length > 2}
                  coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1.5,
                    slideShadows: true,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={true}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className="mySwiper mt-6 md:mt-8"
                >
                  {competitions && competitions.length > 0
                    ? competitions.map((competition, index) => (
                        <SwiperSlide key={index} className="mb-10">
                          {renderContent(competition)}
                        </SwiperSlide>
                      ))
                    : ""}
                </Swiper>
              )}
            </FadeInWhenVisible>
          </div>
        </div>

        <style>{`
                .mySwiper {
                    padding: 0 5% !important;
                    width: 100%;
                }
                .swiper-wrapper {
                    align-items: center;
                }
                .swiper-pagination-bullet {
                    background: white;
                    opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: #8b5cf6;
                }
                .swiper-button-next{
                   background-image: url("/arrow-right.svg");
                    background-repeat: no-repeat;
                    background-position: center;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .swiper-button-prev {
                   background-image: url("/arrow-left.svg");
                    background-repeat: no-repeat;
                    background-position: center;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .swiper-button-next:after,
                .swiper-button-prev:after {
                    display: none;
                }
                @media (max-width: 640px) {
                    .swiper-button-next,
                    .swiper-button-prev {
                        display: none;
                    }
                }
            `}</style>
      </section>
    </div>
  );
};

export default Competitions;
