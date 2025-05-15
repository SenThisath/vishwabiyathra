"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";

const Quiz = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const getCompetitions = useQuery(api.competitions.getCompetitions);
  const saveMeeting = useMutation(api.meetings.saveMeeting);
  const teamCompetitions = getCompetitions?.filter(
    (competition) => competition.isTeam === true,
  );
  const [selectedCompetition, setSelectedCompetition] =
    useState<Id<"competitions">>();
  console.log(selectedCompetition);
  if (!client || !user) {
    return <div>loading...</div>;
  }

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          custom: { description: "hello meeting" },
        },
      });
      setCall(call);
      console.log(selectedCompetition);
      if (selectedCompetition) {
        saveMeeting({
          competitionId: selectedCompetition,
          link: `${call?.id}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center space-y-6">
      <h1>Welcome</h1>
      <Select
        onValueChange={(value) =>
          setSelectedCompetition(value as Id<"competitions">)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Team Competition" />
        </SelectTrigger>
        <SelectContent>
          {teamCompetitions?.map((competition) => (
            <SelectItem key={competition._id} value={competition._id}>
              {competition.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={createMeeting}>Create a new Meeting</Button>
      <p>{call && `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call?.id}`}</p>
    </div>
  );
};

export default Quiz;
