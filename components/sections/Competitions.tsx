"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Title } from "../Title";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

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
import SingleForm from "../SingleForm";

const Competitions = () => {
  const [anonId, setAnonId] = useState<string | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const competitions = useQuery(api.competitions.getCompetitions);
  const [isOneSlide, setIsOneSlide] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<{
    _id: Id<"competitions">;
    _creationTime: number;
    name: string;
    description: string;
    startTime: number;
    endTime: number;
    isOpened: boolean;
    isTeam: boolean;
    rules?: string;
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
    startTime: number;
    endTime: number;
    isOpened: boolean;
    isTeam: boolean;
    rules?: string;
  }) => {
    return !competition.isTeam;
  };

  const [modalOpen, setModelOpen] = useState(false);

  const renderContent = (competition: {
    _id: Id<"competitions">;
    _creationTime: number;
    name: string;
    description: string;
    startTime: number;
    endTime: number;
    isOpened: boolean;
    isTeam: boolean;
    rules?: string;
  }) => {
    return (
      <div
        className={`bg-black rounded-4xl overflow-hidden shadow-xl transform transition-all duration-300 comicFont min-h-[400px] flex flex-col justify-around`}
        id="competitions"
      >
        <div className="relative bg-black p-4 rounded-t-4xl">
          <div className="w-full aspect-[2/1] flex items-center justify-center">
            <Image
              src={"/logo.png"}
              alt={`Competition ${+1}`}
              width={400}
              height={200}
              className="object-contain h-full w-full pt-19"
            />
          </div>
        </div>
        <div className="p-6">
          <h3
            className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent "
          >
            {competition.name}
          </h3>
          <p className="text-gray-300 text-sm md:text-base mb-4">
            {competition.description}
          </p>

          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="uppercase font-bold text-white px-6 py-2 rounded-full border-2 border-pink-500 mt-5">
                  Inter-School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] md:max-w-5xl w-full max-h-[70vh] bg-black overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-end">
                  <div className="p-4 flex items-center justify-center">
                    <Dialog open={modalOpen} onOpenChange={setModelOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className={`rounded-full border-2 font-bold text-lg uppercase w-full
                            ${competition.isOpened ? "border-orange-400" : "border-gray-400 text-gray-400 cursor-not-allowed"}
                            ${!!getReservations?.find((res) => res.competitionId === competition._id) ? "bg-green-100 text-green-700 border-green-300" : ""}`}
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
                            if (!user) return "Please Sign In To Continue.";
                            if (reservation) {
                              const isTeamMember =
                                reservation.teamMembers?.find(
                                  (member) => member.user === user.id,
                                );
                              if (isTeamMember) return "You're a Team Member";
                              return "Registered";
                            }
                            return competition.isOpened
                              ? "Inter-School Competition"
                              : "Coming Soon...!";
                          })()}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] md:max-w-5xl w-full h-[95vh] overflow-hidden bg-black rounded-3xl border-none">
                        {selectedCompetition && selectedCompetition.isTeam ? (
                          <div className="bg-black">
                            <TeamForm
                              {...selectedCompetition}
                              setModelOpen={setModelOpen}
                            />
                          </div>
                        ) : (
                          selectedCompetition && (
                            <SingleForm {...selectedCompetition} />
                          )
                        )}
                      </DialogContent>
                    </Dialog>

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
                        getInter
                          ?.find(
                            (inter) =>
                              inter.reservationId ===
                              getReservations?.find(
                                (res) => res.competitionId === competition._id,
                              )?._id,
                          )
                          ?.teamMarks?.some((mark) => mark.user === user.id) ? (
                          <Button
                            variant="destructive"
                            disabled
                            className="mt-4 text-white font-bold"
                          >
                            You&apos;ve already Submitted the quiz.
                          </Button>
                        ) : (
                          <Button
                            asChild
                            className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 items-center justify-center gap-2 mt-4 w-32 mx-auto"
                          >
                            <Link
                              href={`/quiz/${competition._id}`}
                              className="items-center justify-center"
                            >
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                              </span>
                              Join Live
                            </Link>
                          </Button>
                        )
                      ) : getReservations.find(
                          (res) => res.competitionId === competition._id,
                        )?._id ===
                        getInter?.find((inter) => inter.reservationId)
                          ?.reservationId ? (
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
                                      <DialogTitle>
                                        Submit Your Project
                                      </DialogTitle>
                                    </DialogHeader>
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = new FormData(
                                          e.currentTarget,
                                        );
                                        const projectLink =
                                          form.get("projectLink");
                                        if (
                                          projectLink &&
                                          selectedCompetition &&
                                          anonId
                                        ) {
                                          patchIntra({
                                            userId: anonId,
                                            competitionId:
                                              selectedCompetition._id,
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
                              <Button
                                asChild
                                className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 items-center justify-center gap-2 mt-4 w-32 mx-auto"
                              >
                                <Link
                                  href={`/quiz/${
                                    getIntra?.find(
                                      (intra) =>
                                        intra.userId === anonId &&
                                        intra.competitionId === competition._id,
                                    )?._id
                                  }`}
                                  className="items-center justify-center"
                                >
                                  <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                  </span>
                                  Join Live
                                </Link>
                              </Button>
                            )
                          ) : undefined}
                        </>
                      )}
                  </div>
                </DialogHeader>
                <div className="p-4">
                  <h3
                    className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent  text-center"
                  >
                    Rules and Regulations
                  </h3>
                  <ReactMarkdown
                    components={{
                      h3: ({ children }) => (
                        <h3
                          className="font-bold bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent  mb-4"
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-300 mb-4">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 text-gray-300 mb-4 space-y-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-300">{children}</li>
                      ),
                    }}
                  >
                    {competition.rules}
                  </ReactMarkdown>
                </div>
              </DialogContent>
            </Dialog>

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
                getInter
                  ?.find(
                    (inter) =>
                      inter.reservationId ===
                      getReservations?.find(
                        (res) => res.competitionId === competition._id,
                      )?._id,
                  )
                  ?.teamMarks?.some((mark) => mark.user === user.id) ? (
                  <Button
                    variant="destructive"
                    disabled
                    className="mt-4 text-white font-bold"
                  >
                    You&apos;ve already Submitted the quiz.
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4 w-32 mx-auto"
                  >
                    <Link
                      href={`/quiz/${competition._id}`}
                      className="flex items-center justify-center"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                      </span>
                      Join Live
                    </Link>
                  </Button>
                )
              ) : getReservations.find(
                  (res) => res.competitionId === competition._id,
                )?._id ===
                getInter?.find((inter) => inter.reservationId)
                  ?.reservationId ? (
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
                      <Button
                        asChild
                        className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4 w-48 mx-auto"
                      >
                        <Link
                          href={`/quiz/${
                            getIntra?.find(
                              (intra) =>
                                intra.userId === anonId &&
                                intra.competitionId === competition._id,
                            )?._id
                          }`}
                          className="flex items-center justify-center"
                        >
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                          </span>
                          Intra Join Live
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="uppercase font-bold text-white px-6 py-2 rounded-full border-2 border-pink-500 m-5">
                          Intra-School
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] md:max-w-5xl w-full max-h-[70vh] bg-black overflow-y-auto">
                        <DialogHeader className="flex flex-row items-center justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="mt-4 px-6 py-2 rounded-full border-2 border-pink-500 font-bold text-lg uppercase"
                                onClick={() =>
                                  setSelectedCompetition(competition)
                                }
                              >
                                Register Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black overflow-y-auto max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle className="bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 bg-clip-text text-transparent text-center">
                                  Enter Student Details
                                </DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const form = new FormData(e.currentTarget);
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

                                    if (!anonId) {
                                      localStorage.setItem("id", userId);
                                      setAnonId(userId);
                                    }
                                  } else {
                                    alert("Please fill all fields.");
                                  }
                                }}
                                className="space-y-4"
                              >
                                <Input
                                  name="studentName"
                                  placeholder="Enter full name"
                                  className="bg-white placeholder:italic"
                                />
                                <Input
                                  name="admissionNumber"
                                  type="number"
                                  placeholder="Admission number"
                                  className="bg-white placeholder:italic"
                                />
                                <Input
                                  name="grade"
                                  placeholder="Grade"
                                  type="number"
                                  className="bg-white placeholder:italic"
                                />
                                <Input
                                  name="cls"
                                  placeholder="Class"
                                  className="bg-white placeholder:italic"
                                />
                                <Input
                                  name="whatsapp"
                                  placeholder="WhatsApp number"
                                  type="number"
                                  className="bg-white placeholder:italic"
                                />
                                <Button
                                  type="submit"
                                  className="uppercase font-bold text-white px-6 py-2 rounded-full border-2 border-pink-500 hover:bg-pink-500 transition-colors duration-200 mt-5"
                                >
                                  Register
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </DialogHeader>
                        <div className="p-4">
                          <h3
                            className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent  text-center"
                          >
                            Rules and Regulations
                          </h3>
                          <ReactMarkdown
                            components={{
                              h3: ({ children }) => (
                                <h3
                                  className="text-xl font-bold bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent  mb-4"
                                >
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="text-gray-300 mb-4">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-6 text-gray-300 mb-4 space-y-2">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-gray-300">{children}</li>
                              ),
                            }}
                          >
                            {competition.rules}
                          </ReactMarkdown>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
          </div>
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
