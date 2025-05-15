"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

const QuizPage = () => {
  const params = useParams();
  const { user } = useUser();
  const competitionId = params.id as Id<"competitions">;

  const competition = useQuery(api.competitions.getCompetitionById, {
    competitionId,
  });
  const getReservations = useQuery(api.reservations.getReservations);

  const reservation = getReservations?.find((res) => {
    if (res.competitionId === competition?._id) {
      if (competition.isTeam) {
        return (
          res.teamMembers?.some((member) => member.user === user?.id) ||
          res.teamLeader === user?.id
        );
      }
      return true;
    }
    return false;
  });

  const fetchedUsers = useQuery(api.users.fetchedUsers);

  const enrichedReservation = {
    id: reservation?._id,
    teamMembers: reservation?.teamMembers
      ? reservation.teamMembers.map((member) => {
          const userDetail = fetchedUsers?.find(
            (user) => user.userId === member.user,
          );
          return {
            user: userDetail,
            subject: member.subject,
          };
        })
      : undefined,
    competitionId: reservation?.competitionId,
    teamLeader: fetchedUsers?.find(
      (user) => user.userId === reservation?.teamLeader,
    ),
  };

  const saveAttendance = useMutation(api.meetings.saveAttendance);

  console.log(enrichedReservation);

  const getAttendance = useQuery(api.meetings.getAttendance, { competitionId });

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <p className="text-sm mt-1">Competition Name: {competition?.name}</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Team Information</h2>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-gray-700 mb-3">Team Leader</h3>
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="font-medium">
                  {enrichedReservation?.teamLeader?.name}
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
                    onClick={() => {
                      if (getAttendance && user) {
                        const updatedAttendance = [
                          ...(getAttendance.isJoined || []),
                        ];
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
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Mark Attended
                  </button>
                ) : (
                  "no"
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-gray-700 mb-3">Team Members</h3>
            <div className="space-y-3">
              {enrichedReservation?.teamMembers?.map((member, index) => (
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
                        onClick={() => {
                          if (getAttendance && user) {
                            const updatedAttendance = [
                              ...(getAttendance.isJoined || []),
                            ];
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
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark Attended
                      </button>
                    ) : (
                      "no"
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            {getAttendance && getAttendance.link ? (
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                onClick={() => {
                  const link = getAttendance.link;
                  console.log(link);
                  router.push(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${link}`,
                  );
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
