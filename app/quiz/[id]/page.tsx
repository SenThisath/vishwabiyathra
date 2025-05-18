"use client";

import Meeting from "@/components/Meeting";
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

  console.log(userIntraEntry?.subject)

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
            The competition you're looking for doesn't exist or you may not have
            access to it.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <p className="text-sm mt-1">Competition Name: {competition?.name}</p>
          <p className="text-xs mt-1">
            Type:{" "}
            {competition?.isTeam
              ? "Team Competition"
              : "Individual Competition"}
          </p>
        </div>

        <div className="p-6">
          {/* Team View */}
          {currentView === "team" && enrichedReservation && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Team Information</h2>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-gray-700 mb-3">Team Leader</h3>
                <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                  <div>
                    <p className="font-medium">
                      {enrichedReservation.teamLeader?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {enrichedReservation.teamLeader?.email}
                    </p>
                  </div>
                  <div>
                    {getAttendance?.isJoined?.find(
                      (member) =>
                        member.user === enrichedReservation.teamLeader?.userId,
                    )?.status === true ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Attended
                      </span>
                    ) : enrichedReservation.teamLeader?.userId === user?.id ? (
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
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-gray-700 mb-3">Team Members</h3>
                <div className="space-y-3">
                  {enrichedReservation.teamMembers?.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{member.user?.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.user?.email}
                        </p>
                        <p className="text-xs text-gray-400">
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
                  {userIntraEntry.subject && (
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{userIntraEntry.subject}</p>
                    </div>
                  )}
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
                  {userIntraEntry.marks && (
                    <div>
                      <p className="text-sm text-gray-500">Marks</p>
                      <p className="font-medium">{userIntraEntry.marks}</p>
                    </div>
                  )}
                  {userIntraEntry.time && (
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {userIntraEntry.time} minutes
                      </p>
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
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                onClick={() => {
                  setShowMeeting(true);
                }}
              >
                Join Meeting
              </button>
            ) : (
              <p className="text-gray-500">No meeting link available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
