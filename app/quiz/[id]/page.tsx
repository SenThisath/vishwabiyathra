"use client";

import Meeting from "@/components/Meeting";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const QuizPage = () => {
  const { user } = useUser();
  const anonId = localStorage.getItem("id");
  const params = useParams();
  const urlId = params.id as string;

  // State to track what type of ID we have and the identified competition
  const [isIntraId, setIsIntraId] = useState<boolean>(false);
  const [identifiedCompetitionId, setIdentifiedCompetitionId] =
    useState<Id<"competitions"> | null>(null);

  // Get all competitions and intra entries to determine what type of ID we have
  const allCompetitions = useQuery(api.competitions.getCompetitions);
  const getIntraEntries = useQuery(api.intra.getIntra);

  // Find out if the ID is a competition ID or an intra ID
  useEffect(() => {
    if (!urlId || !allCompetitions || !getIntraEntries) return;

    // Check if the ID is a direct competition ID
    const directCompetition = allCompetitions.find(
      (comp) => comp._id === urlId,
    );
    if (directCompetition) {
      setIsIntraId(false);
      setIdentifiedCompetitionId(urlId as Id<"competitions">);
      return;
    }

    // Check if the ID is an intra ID
    const intraEntry = getIntraEntries.find((entry) => entry._id === urlId);
    if (intraEntry) {
      setIsIntraId(true);
      setIdentifiedCompetitionId(intraEntry.competitionId);
      return;
    }

    // If neither, reset states
    setIsIntraId(false);
    setIdentifiedCompetitionId(null);
  }, [urlId, allCompetitions, getIntraEntries]);

  // Get competition details using the identified competition ID
  const competition = useQuery(
    api.competitions.getCompetitionById,
    identifiedCompetitionId
      ? { competitionId: identifiedCompetitionId }
      : "skip",
  );

  const getReservations = useQuery(api.reservations.getReservations);

  const [showMeeting, setShowMeeting] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"team" | "individual">("team");
  const getInter = useQuery(api.inter.getInter);

  // Update current view whenever competition data changes
  useEffect(() => {
    if (competition) {
      setCurrentView(competition.isTeam ? "team" : "individual");
    }
  }, [competition]);

  // Find the specific intra entry if we are coming from an intraId
  const userIntraEntry = getIntraEntries?.find((entry) =>
    isIntraId
      ? entry._id === urlId
      : entry.competitionId === identifiedCompetitionId &&
        entry.userId === anonId,
  );

  // Find team reservation if this is a team competition
  const teamReservation = getReservations?.find((res) => {
    if (res.competitionId === identifiedCompetitionId && competition?.isTeam) {
      return (
        res.teamMembers?.some((member) => member.user === user?.id) ||
        res.teamLeader === user?.id
      );
    }
    return false;
  });

  const fetchedUsers = useQuery(api.users.fetchedUsers);

  // Enrich team reservation with user details
  const enrichedReservation = teamReservation
    ? {
        id: teamReservation._id,
        teamMembers: teamReservation.teamMembers
          ? teamReservation.teamMembers.map((member) => {
              const userDetail = fetchedUsers?.find(
                (user) => user.userId === member.user,
              );
              return {
                user: userDetail,
                subject: member.subject,
              };
            })
          : undefined,
        competitionId: teamReservation.competitionId,
        teamLeader: fetchedUsers?.find(
          (user) => user.userId === teamReservation.teamLeader,
        ),
      }
    : null;

  const saveAttendance = useMutation(api.meetings.saveAttendance);
  const getAttendance = useQuery(
    api.meetings.getAttendance,
    identifiedCompetitionId
      ? { competitionId: identifiedCompetitionId }
      : "skip",
  );

  if (!user) return <div>No User</div>;

  // Show loading state while we're determining the competition
  if (
    !identifiedCompetitionId &&
    getIntraEntries &&
    allCompetitions &&
    (allCompetitions?.length > 0 || getIntraEntries?.length > 0)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-lg text-gray-600">
            Loading competition details...
          </p>
        </div>
      </div>
    );
  }

  // Show error if we can't find the competition
  if (!competition && identifiedCompetitionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <p className="text-xl text-red-600 mb-2">Competition not found</p>
          <p className="text-gray-600">
            The competition you&apos;re looking for doesn&apos;t exist or you
            may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  if (showMeeting && getAttendance) {
    return <Meeting id={getAttendance?.link} />;
  }

  const handleMarkAttendance = () => {
    if (getAttendance && user) {
      const updatedAttendance = [...(getAttendance.isJoined || [])];
      const userIndex = updatedAttendance.findIndex(
        (item) => item.user === user.id,
      );
      if (userIndex !== -1) {
        updatedAttendance[userIndex].status = true;
      } else {
        updatedAttendance.push({
          user: user.id,
          status: true,
        });
      }
      saveAttendance({
        meeting: getAttendance._id,
        isJoined: updatedAttendance,
      });
    }
  };

  // Check if current user has marked attendance
  const hasAttended =
    getAttendance?.isJoined?.find((member) => member.user === user.id)
      ?.status === true;

  console.log(enrichedReservation);

  return (
    <div className="min-h-screen bg-black py-8">
      {currentView === "team" &&
      getInter?.find(
        (inter) =>
          inter.reservationId === enrichedReservation?.id &&
          inter.teamMarks?.some((mark) => mark.user === user.id),
      ) ? (
        <div>
          <div className="max-w-3xl mx-auto p-8 bg-black border border-gray-100 rounded-lg text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                Competition Completed!
              </h2>
              <p className="text-gray-400 text-lg">
                You have successfully completed this competition. Check back
                later for results!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-black border border-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-black border border-b-gray-100 text-white">
            <p className="text-sm mt-1 bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent text-center uppercase font-bold">
              Competition Name: {competition?.name}
            </p>
          </div>

          <div className="p-6">
            {/* Te</div>am View */}
            {currentView === "team" && enrichedReservation && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                    Team Information
                  </h2>
                </div>

                <div className="mb-8">
                  <div className="space-y-3">
                    {enrichedReservation.teamMembers?.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {member.user?.name}
                          </p>
                          <p className="text-sm text-white">
                            {member.user?.email}
                          </p>
                          <p className="text-xs text-white">
                            Subject: {member.subject}
                          </p>
                        </div>
                        <div>
                          {getAttendance?.isJoined?.find(
                            (isMember) => member.user?.userId === isMember.user,
                          )?.status === true ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Attended
                            </span>
                          ) : member.user?.userId === user?.id ? (
                            <button
                              onClick={handleMarkAttendance}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Mark Attended
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                              Not Attended
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Individual View */}
            {currentView === "individual" && userIntraEntry && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Individual Registration
                </h2>
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{userIntraEntry.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Admission Number</p>
                      <p className="font-medium">
                        {userIntraEntry.admissionNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Grade & Class</p>
                      <p className="font-medium">
                        Grade {userIntraEntry.grade}, {userIntraEntry.cls}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp Number</p>
                      <p className="font-medium">
                        {userIntraEntry.whatsAppNumber}
                      </p>
                    </div>
                    {userIntraEntry.subjectMarks?.map((subjectMarks) => (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Subject</p>
                          <p className="font-medium">{subjectMarks.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Marks</p>
                          <p className="font-medium">{subjectMarks.marks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">
                            {subjectMarks.time} minutes
                          </p>
                        </div>
                      </>
                    ))}
                    {userIntraEntry.projectLink && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Project Link</p>
                        <a
                          href={userIntraEntry.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {userIntraEntry.projectLink}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    {hasAttended ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Attended
                      </span>
                    ) : (
                      <button
                        onClick={handleMarkAttendance}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark Attended
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* No registration found */}
            {(currentView === "team" && !enrichedReservation) ||
            (currentView === "individual" && !userIntraEntry) ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">
                  No registration found for this competition
                </p>
              </div>
            ) : null}

            {/* Meeting button */}
            <div className="mt-8 text-center">
              {getAttendance && getAttendance.link ? (
                <Button
                  asChild
                  onClick={() => {
                    setShowMeeting(true);
                  }}
                  className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4 w-32 mx-auto cursor-pointer"
                >
                  <div>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                    Join Live
                  </div>
                </Button>
              ) : (
                <p className="text-gray-500">No meeting link available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
