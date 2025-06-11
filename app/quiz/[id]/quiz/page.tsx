"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { subjects } from "@/components/SubjectSelection";

export default function QuizApp() {
  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [showFeedbackAlert, setShowFeedbackAlert] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [competitionType, setCompetitionType] = useState<
    "inter" | "intra" | null
  >(null);
  const [userSubject, setUserSubject] = useState("");
  const [identifiedCompetitionId, setIdentifiedCompetitionId] =
    useState<Id<"competitions"> | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [subjectSelectionMode, setSubjectSelectionMode] = useState(true);
  const [completedSubjects, setCompletedSubjects] = useState<string[]>([]);

  const { user } = useUser();
  const params = useParams();
  const urlId = params.id as string;
  const anonId = localStorage.getItem("id");

  const allCompetitions = useQuery(api.competitions.getCompetitions);
  const getAllIntra = useQuery(api.intra.getIntra);
  const getReservations = useQuery(api.reservations.getReservations);
  const allQuizzes = useQuery(api.quizzes.getAllQuizzes);

  // Identify the competition type and ID from URL
  useEffect(() => {
    if (!urlId || !allCompetitions || !getAllIntra) return;

    const directCompetition = allCompetitions.find(
      (comp) => comp._id === urlId,
    );

    if (directCompetition) {
      setIdentifiedCompetitionId(urlId as Id<"competitions">);
    } else {
      const intraEntry = getAllIntra.find((entry) => entry._id === urlId);
      if (intraEntry) {
        setIdentifiedCompetitionId(intraEntry.competitionId);
      }
    }
  }, [urlId, allCompetitions, getAllIntra]);

  const competition = useQuery(
    api.competitions.getCompetitionById,
    identifiedCompetitionId
      ? { competitionId: identifiedCompetitionId }
      : "skip",
  );

  // Determine competition type and user subject
  useEffect(() => {
    if (!user || !identifiedCompetitionId || !getAllIntra || !getReservations)
      return;

    const teamReservation = getReservations?.find((res) => {
      if (res.competitionId === identifiedCompetitionId) {
        return (
          res.teamMembers?.some((member) => member.user === user.id) ||
          res.teamLeader === user.id
        );
      }
      return false;
    });

    const userIntraEntry = getAllIntra?.find(
      (entry) =>
        entry.competitionId === identifiedCompetitionId &&
        entry.userId === anonId,
    );

    if (teamReservation) {
      setCompetitionType("inter");
      const currentMember = teamReservation.teamMembers?.find(
        (member) => member.user === user.id,
      );

      if (currentMember) {
        setUserSubject(currentMember.subject);
      }
    } else if (userIntraEntry) {
      setCompetitionType("intra");

      // For intra, we'll handle subject selection separately
      // but we'll set completed subjects first
      if (
        userIntraEntry.subjectMarks &&
        Array.isArray(userIntraEntry.subjectMarks)
      ) {
        const completed = userIntraEntry.subjectMarks.map(
          (mark) => mark.subject,
        );
        setCompletedSubjects(completed);
      }
    }
  }, [
    identifiedCompetitionId,
    user,
    anonId,
    competition,
    getReservations,
    getAllIntra,
  ]);

  // Get available subjects for intra competitions
  useEffect(() => {
    if (competitionType !== "intra" || !allQuizzes) return;

    // Get unique subjects from quizzes that are for intra competitions
    const subjects = new Set<string>();

    allQuizzes.forEach((quiz) => {
      if (
        quiz.subject &&
        quiz.quizzes &&
        quiz.quizzes.some((q) => q.quizType === "intra")
      ) {
        subjects.add(quiz.subject);
      }
    });

    // Filter out completed subjects
    const available = Array.from(subjects).filter(
      (subject) => !completedSubjects.includes(subject),
    );

    setAvailableSubjects(available);

    // If no subjects left, show completed message
    if (available.length === 0 && completedSubjects.length > 0) {
      setSubjectSelectionMode(false);
      setQuizCompleted(true);
      setResultSubmitted(true);
    }
  }, [allQuizzes, competitionType, completedSubjects]);

  // Select a subject for intra competition
  const selectSubject = (subject: string) => {
    setUserSubject(subject);
    setSubjectSelectionMode(false);
  };

  const quizzes = useQuery(api.quizzes.getAllQuizzes);
  const [quizQuestions, setQuizQuestions] = useState<
    {
      image?: string | undefined;
      quizType: string;
      quiz: string;
      answers: {
        answer: string;
        isCorrect: boolean;
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (!userSubject || !competitionType || !quizzes) return;

    const loadQuizzes = async () => {
      try {
        const filtered = quizzes
          .filter((q) => q.subject === userSubject)
          .flatMap((q) =>
            (q.quizzes || []).filter(
              (quiz) => quiz.quizType === competitionType,
            ),
          );

        setQuizQuestions(filtered);
      } catch (error) {
        console.error("Failed to load quizzes:", error);
      }
    };

    loadQuizzes();
  }, [userSubject, competitionType, quizzes]);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const getInter = useQuery(api.inter.getInter);

  const reservation = getReservations?.find(
    (res) => res.competitionId === identifiedCompetitionId,
  );

  const getInterByReservationId = getInter?.find(
    (inter) => inter.reservationId === reservation?._id,
  );

  const insertInter = useMutation(api.inter.insertInter);
  const patchInter = useMutation(api.inter.patchInter);
  const patchIntra = useMutation(api.intra.patchIntra);

  // Timer management
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeout(() => {
      setIsRunning(true);
    }, 500);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return;

    setFeedbackShown(true);

    const correct = currentQuestion.answers[answerIndex].isCorrect;
    setIsCorrect(correct);

    const newScore = correct ? score + 1 : score;

    // Update score if answer is correct
    if (correct) {
      setScore(newScore);
    }

    // Show feedback alert
    setShowFeedbackAlert(true);

    // Move to next question after delay
    setTimeout(() => {
      setShowFeedbackAlert(false);

      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setFeedbackShown(false);
        } else {
          // End quiz
          setIsRunning(false);
          setQuizCompleted(true);

          // Submit the quiz results only once with the final score
          if (!resultSubmitted) {
            submitQuizResults(newScore);
          }
        }
      }, 300);
    }, 1500);
  };

  // Define TeamMark interface to fix type error
  interface TeamMark {
    user: string;
    subject: string;
    marks: number;
    time: number;
  }

  // Submit quiz results based on competition type
  const submitQuizResults = async (finalScore = score) => {
    if (!identifiedCompetitionId) return;

    try {
      // Handle inter-competition (team-based)
      if (competitionType === "inter" && reservation && userSubject && user) {
        const teamMarksData: TeamMark = {
          user: user.id,
          subject: userSubject,
          marks: finalScore,
          time: timer,
        };

        // Check if there's an existing inter record
        const existingInter = getInterByReservationId;

        if (existingInter) {
          // Update existing inter record
          let updatedTeamMarks: TeamMark[] = [];

          if (
            existingInter.teamMarks &&
            Array.isArray(existingInter.teamMarks)
          ) {
            // Filter out any existing entries for this user/subject
            updatedTeamMarks = existingInter.teamMarks.filter(
              (mark: TeamMark) =>
                !(mark.user === user.id && mark.subject === userSubject),
            );
          }

          // Add the new marks
          updatedTeamMarks.push(teamMarksData);

          // Use patchInter to update the existing record
          await patchInter({
            reservationId: reservation._id,
            teamMarks: updatedTeamMarks,
          });
        } else {
          // Create new inter record
          await insertInter({
            reservationId: reservation._id,
            teamMarks: [teamMarksData],
          });
        }
      }
      // Handle intra-competition (individual)
      else if (competitionType === "intra" && anonId) {
        // Get existing intra record
        const userIntraEntry = getAllIntra?.find(
          (entry) =>
            entry.competitionId === identifiedCompetitionId &&
            entry.userId === anonId,
        );

        if (userIntraEntry) {
          // Prepare subject marks data
          const newSubjectMark = {
            subject: userSubject,
            marks: finalScore,
            time: timer,
          };

          // Get existing subject marks or initialize empty array
          let updatedSubjectMarks = userIntraEntry.subjectMarks || [];

          // If updatedSubjectMarks is not an array, initialize it
          if (!Array.isArray(updatedSubjectMarks)) {
            updatedSubjectMarks = [];
          }

          // Filter out any existing entry for this subject
          updatedSubjectMarks = updatedSubjectMarks.filter(
            (mark) => mark.subject !== userSubject,
          );

          // Add the new mark
          updatedSubjectMarks.push(newSubjectMark);

          // Update the intra record
          await patchIntra({
            userId: anonId,
            competitionId: identifiedCompetitionId,
            subjectMarks: updatedSubjectMarks,
          });

          // Update completed subjects locally
          setCompletedSubjects((prev) => [...prev, userSubject]);
        }
      }

      setResultSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz results:", error);
    }
  };


  // Show subject selection for intra competition
  if (subjectSelectionMode && competitionType === "intra") {
    return (
      <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full bg-transparent shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
              Select a Subject
            </CardTitle>
            <CardDescription className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
              Choose a subject to start the quiz
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {availableSubjects.length > 0 ? (
              availableSubjects.map((subject) => (
                <Button
                  key={subject}
                  onClick={() => selectSubject(subject)}
                  variant="outline"
                  disabled={getAllIntra?.some(
                    (entry) =>
                      entry.userId === anonId &&
                      entry.subjectMarks?.some(
                        (mark) =>
                          (mark.subject === "Combined Mathematics" &&
                            subject === "Biology") ||
                          (mark.subject === "Biology" &&
                            subject === "Combined Mathematics") ||
                          (mark.subject === "Chemistry" && subject === "ICT") ||
                          (mark.subject === "ICT" && subject === "Chemistry"),
                      ),
                  )}
                  className={`w-full py-6 text-lg justify-start border-2 ${
                    getAllIntra?.some(
                      (entry) =>
                        entry.userId === anonId &&
                        entry.subjectMarks?.some(
                          (mark) =>
                            (mark.subject === "Combined Mathematics" &&
                              subject === "Biology") ||
                            (mark.subject === "Biology" &&
                              subject === "Combined Mathematics") ||
                            (mark.subject === "Chemistry" &&
                              subject === "ICT") ||
                            (mark.subject === "ICT" && subject === "Chemistry"),
                        ),
                    )
                      ? ""
                      : "hover:border-purple-500 hover:bg-purple-50"
                  }`}
                >
                  {subjects.find((s) => s.name === subject)?.icon} {subject}
                </Button>
              ))
            ) : (
              <Alert className="bg-amber-100 border-amber-300 text-amber-800">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="ml-2">No subjects available</AlertTitle>
                <AlertDescription>
                  Please check back later or contact the administrator.
                </AlertDescription>
              </Alert>
            )}

            {getAllIntra?.find(
              (entry) =>
                entry.competitionId === identifiedCompetitionId &&
                entry.userId === anonId &&
                entry.subjectMarks &&
                entry.subjectMarks.length > 0,
            ) && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Completed subjects:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getAllIntra
                    ?.find(
                      (entry) =>
                        entry.competitionId === identifiedCompetitionId &&
                        entry.userId === anonId,
                    )
                    ?.subjectMarks?.map((mark) => (
                      <Badge
                        key={mark.subject}
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        <CheckCircle size={12} className="mr-1" />
                        {mark.subject}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while determining user subject
  if (!userSubject && !subjectSelectionMode && !quizCompleted && competition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="max-w-md p-6 text-center">
          <CardTitle className="text-xl mb-4">Loading Quiz</CardTitle>
          <CardDescription>
            Getting your subject and questions ready...
          </CardDescription>
          <Progress value={80} className="h-2 mt-4 bg-gray-200" />
        </Card>
      </div>
    );
  }

  // Show all subjects completed message
  if (
    competitionType === "intra" &&
    quizCompleted &&
    resultSubmitted &&
    completedSubjects.length > 3
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="max-w-md bg-white shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Trophy size={32} className="text-green-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-900">
              All Subjects Completed!
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-center text-gray-700 mb-6">
              You have completed all available subjects for this competition.
            </p>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Completed subjects:
              </p>
              <div className="flex flex-wrap gap-2">
                {getAllIntra
                  ?.find(
                    (entry) =>
                      entry.competitionId === identifiedCompetitionId &&
                      entry.userId === anonId,
                  )
                  ?.subjectMarks?.map((mark) => (
                    <Badge
                      key={mark.subject}
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      <CheckCircle size={12} className="mr-1" />
                      {mark.subject}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden comicFont">
      <div className="container mx-auto max-w-4xl relative z-10">
        {!quizStarted ? (
          // Welcome Screen
          <Card className="bg-black shadow-2xl overflow-hidden">
            <CardHeader className="text-center pb-2 relative">
              <CardTitle
                className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent"
              >
                {userSubject || "Quiz Time"}
              </CardTitle>
              <CardDescription
                className="bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent mt-2 text-lg"
              >
                Test your knowledge with this awesome quiz
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 pb-6">
              <div className="space-y-4 text-center mb-8">
                <div className="px-4 py-3 rounded-lg bg-black flex items-center justify-center space-x-3">
                  <Badge
                    variant="outline"
                    className="py-1.5 px-3 text-indigo-800 border-indigo-300 bg-indigo-100"
                  >
                    <AlertCircle size={14} className="mr-1" />
                    {totalQuestions} Questions
                  </Badge>

                  <Badge
                    variant="outline"
                    className="py-1.5 px-3 text-pink-800 border-pink-300 bg-pink-100"
                  >
                    <Clock size={14} className="mr-1" />
                    Timed Quiz: 30 min
                  </Badge>
                </div>

                <p className="text-white">
                  Are you ready to challenge yourself? This quiz will test your
                  knowledge about {userSubject}. Answer the questions correctly
                  to earn a high score!
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
              <Button
                asChild
                disabled={!currentQuestion}
                onClick={startQuiz}
                className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 w-64 mx-auto cursor-pointer"
              >
                <div>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span className="relative z-10 flex items-center">
                    Start Quiz
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </Button>
            </CardFooter>
          </Card>
        ) : !quizCompleted ? (
          // Quiz in progress
          <>
            {/* Header with progress and stats */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-black bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent font-mono text-7xl mb-4 digital">
                <span className="tabular-nums">{formatTime(timer)}</span>
              </div>
            </div>
            <div className="rounded-lg mb-3 flex items-center justify-end">
              <Badge
                variant="secondary"
                className="flex items-center space-x-2 py-1.5 px-3 bg-green-100 text-green-800"
              >
                <CheckCircle size={14} />
                <span>{score} correct</span>
              </Badge>
            </div>

            {showFeedbackAlert && (
              <Alert
                className={cn(
                  "mb-6 shadow-lg animate-fadeIn border-2",
                  isCorrect
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "bg-red-100 border-red-500 text-red-800",
                )}
              >
                <div className="flex items-center">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <AlertTitle className="ml-2 text-lg">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </AlertTitle>
                </div>
                <AlertDescription className="pl-7">
                  {isCorrect
                    ? "Great job! Moving to the next question..."
                    : `The correct answer was: ${currentQuestion.answers.find((a) => a.isCorrect)?.answer}`}
                </AlertDescription>
              </Alert>
            )}

            {/* Question card */}
            <Card className="bg-transparent">
              <CardHeader>
                <div className="flex justify-center mb-8">
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-xl font-extrabold bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent border-white"
                  >
                    Question {currentQuestionIndex + 1}
                  </Badge>
                </div>
                <CardTitle className="text-3xl text-center font-bold bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                  {currentQuestion?.quiz}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-10 relative z-10">
                {currentQuestion?.image && (
                  <div className="flex justify-center">
                    <div className="relative rounded-lg overflow-hidden border-2 shadow-xl">
                      <img
                        src={currentQuestion.image}
                        alt="Question"
                        className="rounded-lg max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion?.answers.map((answer, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className="py-8 text-2xl"
                      disabled={feedbackShown}
                    >
                      {answer.answer}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Quiz completed view
          <>
            <Card className="bg-transparent shadow-2xl max-w-lg mx-auto animate-fadeIn relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-l from-[#d72b59] to-[#fbe851]"></div>

              <CardHeader className="text-center pb-2">
                <div className="text-6xl font-bold mb-2">🏆</div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                  Quiz Completed!
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-white rounded-lg p-4 text-center">
                    <p className="text-white text-sm mb-1">Score</p>
                    <p className="text-3xl font-bold bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                      {score}/{totalQuestions}
                    </p>
                    <p className="text-white text-sm mt-1">
                      {Math.round((score / totalQuestions) * 100)}%
                    </p>
                  </div>

                  <div className="border border-white rounded-lg p-4 text-center">
                    <p className="text-white text-sm mb-1">Time</p>
                    <p className="text-3xl font-bold bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent">
                      {formatTime(timer)}
                    </p>
                    <p className="text-white text-sm mt-1">
                      {Math.round(timer / totalQuestions)} sec/question
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="flex items-center text-gray-800">
                      <CheckCircle size={16} className="text-green-600 mr-2" />
                      Correct Answers
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      {score}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="flex items-center text-gray-800">
                      <XCircle size={16} className="text-red-600 mr-2" />
                      Incorrect Answers
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      {totalQuestions - score}
                    </Badge>
                  </div>
                </div>

                {resultSubmitted && (
                  <div className="px-3 py-2 rounded-full border-2 border-red-600 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8">
                    <div className="flex items-center justify-between gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                      </span>
                      <span className="relative z-10 flex items-center text-white">
                        Your quiz results have been submitted successfully.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="w-full flex items-center justify-end mt-8">
              <div className="relative flex flex-col items-center">
                <div
                  onClick={() => (window.location.href = "/")}
                  className="bg-transparent text-white z-10 relative -mb-8 "
                >
                  Back to Home
                </div>
                <img src="/arrow-right.svg" alt="Back" className="w-15 ml-40" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
