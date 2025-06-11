"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface Subject {
  name: string;
  icon: string;
  color: string;
}

export const subjects: Subject[] = [
    {
        name: "Combined Mathematics",
        icon: "➗",
        color: "bg-blue-100 dark:bg-blue-900",
    },
    {
        name: "Physics",
        icon: "⚛️",
        color: "bg-green-100 dark:bg-green-900",
    },
    {
        name: "Chemistry",
        icon: "🧪",
        color: "bg-amber-100 dark:bg-amber-900",
    },
    {
        name: "ICT",
        icon: "💻",
        color: "bg-amber-100 dark:bg-amber-900",
    },
    {
        name: "Biology",
        icon: "🧬",
        color: "bg-amber-100 dark:bg-amber-900",
    },
];

export default function SubjectSelection() {
  const saveSubjectOfTeacher = useMutation(api.quizzes.saveSubjectOfTeacher);
  const { user } = useUser();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select a Subject</CardTitle>
        <CardDescription>
          Choose a subject to create quizzes for your students. This will be a
          one time selection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <Button
              key={subject.name}
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center gap-2 ${subject.color} hover:scale-105 transition-transform`}
              onClick={() => {
                if (user) {
                  saveSubjectOfTeacher({
                    teacherId: user.id,
                    subject: subject.name,
                  });
                }
              }}
            >
              <span className="text-2xl">{subject.icon}</span>
              <span className="text-sm font-medium">{subject.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
