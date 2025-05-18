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
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import TeamForm from "../TeamForm";

const Competitions = () => {
  // State to hold the anonymous user ID
  const [anonId, setAnonId] = useState<string | null>(null);
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

  const { user } = useUser();

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setAnonId(storedId);
    }
  }, []);

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

  const getReservations = useQuery(api.reservations.getReservations);

  const insertInter = useMutation(api.inter.insertInter);
  const getInter = useQuery(api.inter.getInter);

  const insertIntra = useMutation(api.intra.insertIntra);
  const getIntra = useQuery(api.intra.getIntra);
  const patchIntra = useMutation(api.intra.patchIntra);

  const isIntraRegistered = (competitionId: Id<"competitions">) => {
    return getIntra?.some(
      (intra) =>
        intra.competitionId === competitionId && intra.userId === anonId,
    );
  };
  const hasSubmittedProject = (competitionId: Id<"competitions">) => {
    const userIntra = getIntra?.find(
      (intra) =>
        intra.userId === anonId && intra.competitionId === competitionId,
    );

    return (
      userIntra &&
      userIntra.projectLink !== undefined &&
      userIntra.projectLink !== null &&
      userIntra.projectLink !== ""
    );
  };

  const requiresProjectSubmission = (competition: {
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
    return !competition.isTeam;
  };

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
      <div className="bg-gradient-to-b from-purple-900/50 to-black rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 comicFont">
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
                    ? "Inter-School Competitor Entry"
                    : "Coming Soon...!";
                })()}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register to {competition.name}</DialogTitle>
              </DialogHeader>
              {selectedCompetition && selectedCompetition.isTeam && (
                <TeamForm {...selectedCompetition} />
              )}
            </DialogContent>
          </Dialog>

          {/* Inter-School Competition Logic (for signed-in users) */}
          {user &&
            getReservations?.find((res) => {
              if (res.competitionId === competition._id) {
                if (competition.isTeam) {
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
            ) : getReservations.find(
                (res) => res.competitionId === competition._id,
              )?._id ===
              getInter?.find((inter) => inter.reservationId)?.reservationId ? (
              <Button>You&apos;ve Submitted Your Project.</Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    onClick={() => {
                      setSelectedCompetition(competition);
                    }}
                  >
                    Submit Your Work.
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Your Project.</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = new FormData(e.currentTarget);
                      const projectLink = form.get("projectLink");
                      if (projectLink) {
                        getReservations?.find((res) => {
                          if (
                            res.competitionId === competition._id &&
                            res.teamLeader === user.id
                          ) {
                            insertInter({
                              reservationId: res._id,
                              projectLink: projectLink.toString(),
                            });
                          }
                        });
                      } else {
                        alert("Please fill all fields.");
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Input name="projectLink" placeholder="Project Link" />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            ))}

          {competition.isOpened &&
            !getReservations?.some(
              (res) => res.competitionId === competition._id,
            ) && (
              <>
                {isIntraRegistered(competition._id) ? (
                  requiresProjectSubmission(competition) ? (
                    hasSubmittedProject(competition._id) ? (
                      <Button className="bg-green-600 text-white mt-4">
                        You&apos;ve Submitted Your Project
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                            onClick={() => {
                              setSelectedCompetition(competition);
                            }}
                          >
                            Submit Your Work
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Your Project</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = new FormData(e.currentTarget);
                              const projectLink = form.get("projectLink");
                              if (
                                projectLink &&
                                selectedCompetition &&
                                anonId
                              ) {
                                patchIntra({
                                  userId: anonId,
                                  competitionId: selectedCompetition._id,
                                  projectLink: projectLink.toString(),
                                });
                              } else {
                                alert("Please fill all fields.");
                              }
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <Input
                                name="projectLink"
                                placeholder="Project Link"
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Submit
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )
                  ) : (
                    /* Competition doesn't require project submission, show participation status */
                    <Button asChild>
                      <Link
                        href={`/quiz/${
                          getIntra?.find(
                            (intra) =>
                              intra.userId === anonId &&
                              intra.competitionId === competition._id,
                          )?._id
                        }`}
                        className="text-white"
                      >
                        Join Live
                      </Link>
                    </Button>
                  )
                ) : (
                  /* User is not registered for this intra-school competition */
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                        onClick={() => setSelectedCompetition(competition)}
                      >
                        Intra-School Competitor Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enter Student Details</DialogTitle>
                      </DialogHeader>
                      {/* Modified Form with Subject Selection for Team Competitions */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = new FormData(e.currentTarget);
                          // Use existing anonId if available, or generate a new one
                          const userId = anonId || crypto.randomUUID();
                          const name = form.get("studentName");
                          const admission = form.get("admissionNumber");
                          const grade = form.get("grade");
                          const cls = form.get("cls");
                          const whatsapp = form.get("whatsapp");

                          if (
                            name &&
                            admission &&
                            grade &&
                            cls &&
                            whatsapp &&
                            selectedCompetition
                          ) {
                            insertIntra({
                              userId,
                              fullName: name.toString(),
                              admissionNumber: Number(admission),
                              grade: Number(grade),
                              cls: cls?.toString(),
                              whatsAppNumber: Number(whatsapp),
                              competitionId: selectedCompetition._id,
                            });

                            // Only store the ID in localStorage if we don't have one already
                            if (!anonId) {
                              localStorage.setItem("id", userId);
                              setAnonId(userId); // Update state as well
                            }
                          } else {
                            alert("Please fill all fields.");
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Input
                            name="studentName"
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Input
                            name="admissionNumber"
                            type="number"
                            placeholder="Admission number"
                          />
                        </div>
                        <div>
                          <Input
                            name="grade"
                            placeholder="Grade"
                            type="number"
                          />
                        </div>
                        <div>
                          <Input name="cls" placeholder="Class" />
                        </div>
                        <div>
                          <Input
                            name="whatsapp"
                            placeholder="WhatsApp number"
                            type="number"
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Register
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
        </div>
      </div>
    );
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
