"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  BrainCircuit,
  Trophy,
  Book,
  LayoutList,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function QuizApp() {
  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>();
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [showFeedbackAlert, setShowFeedbackAlert] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setAnimateIn(true);
    setTimeout(() => {
      setIsRunning(true);
    }, 500);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return;

    setSelectedAnswer(answerIndex);
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
          setSelectedAnswer(null);
          setFeedbackShown(false);
          setAnimateIn(false);

          // Brief pause before animating in the next question
          setTimeout(() => {
            setAnimateIn(true);
          }, 150);
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

  const getAnswerStyle = (index: number) => {
    if (!feedbackShown) {
      return "bg-white text-purple-900 hover:bg-purple-100 hover:border-purple-500 hover:shadow-xl";
    }

    if (currentQuestion.answers[index].isCorrect) {
      return "bg-green-600 hover:bg-green-600 text-white border-green-700";
    }

    if (selectedAnswer === index && !currentQuestion.answers[index].isCorrect) {
      return "bg-red-600 hover:bg-red-600 text-white border-red-700";
    }

    return "opacity-60";
  };

  const getScoreDescription = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "Genius Level!";
    if (percentage >= 75) return "Outstanding!";
    if (percentage >= 60) return "Good job!";
    if (percentage >= 40) return "Not bad!";
    return "Better luck next time!";
  };

  const getScoreEmoji = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "🏆";
    if (percentage >= 75) return "🎯";
    if (percentage >= 60) return "🎉";
    if (percentage >= 40) return "👍";
    return "🌱";
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full bg-white shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Book size={28} className="text-purple-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-900">
              Select a Subject
            </CardTitle>
            <CardDescription className="text-purple-700">
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
                  className="w-full py-6 text-lg justify-start border-2 hover:border-purple-500 hover:bg-purple-50"
                >
                  <LayoutList className="mr-3 text-purple-600" size={20} />
                  <span>{subject}</span>
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

            {completedSubjects.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Completed subjects:
                </p>
                <div className="flex flex-wrap gap-2">
                  {completedSubjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      <CheckCircle size={12} className="mr-1" />
                      {subject}
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
    completedSubjects.length > 0
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
                {completedSubjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-300"
                  >
                    <CheckCircle size={12} className="mr-1" />
                    {subject}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/api/placeholder/2000/2000')] opacity-5 mix-blend-soft-light pointer-events-none"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {!quizStarted ? (
          // Welcome Screen
          <Card className="bg-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

            <CardHeader className="text-center pb-2 relative">
              <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-6 ring-4 ring-purple-200">
                <BrainCircuit size={40} className="text-purple-700" />
              </div>
              <CardTitle className="text-4xl font-bold tracking-tight text-purple-900">
                {userSubject || "Quiz Time"}
              </CardTitle>
              <CardDescription className="text-purple-700 mt-2 text-lg">
                Test your knowledge with this awesome quiz
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 pb-6">
              <div className="space-y-4 text-center mb-8">
                <div className="px-4 py-3 rounded-lg bg-purple-50 flex items-center justify-center space-x-3">
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
                    Timed Quiz
                  </Badge>

                  <Badge
                    variant="outline"
                    className="py-1.5 px-3 text-purple-800 border-purple-300 bg-purple-100"
                  >
                    <Trophy size={14} className="mr-1" />
                    {competitionType === "inter"
                      ? "Team Competition"
                      : "Individual Competition"}
                  </Badge>
                </div>

                <p className="text-gray-700">
                  Are you ready to challenge yourself? This quiz will test your
                  knowledge about {userSubject}. Answer the questions correctly
                  to earn a high score!
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
              <Button
                size="lg"
                disabled={!currentQuestion}
                className="px-8 py-6 text-lg font-semibold group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 border-0 text-white"
                onClick={startQuiz}
              >
                <span className="relative z-10 flex items-center">
                  Start Quiz
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Button>
            </CardFooter>
          </Card>
        ) : !quizCompleted ? (
          // Quiz in progress
          <>
            {/* Header with progress and stats */}
            <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between border border-gray-200 shadow-lg">
              <div className="flex items-center space-x-3">
                <Badge
                  variant="outline"
                  className="text-lg py-1.5 px-3 bg-purple-100 border-purple-300 text-purple-800"
                >
                  {currentQuestionIndex + 1}/{totalQuestions}
                </Badge>

                <Progress
                  value={(currentQuestionIndex / totalQuestions) * 100}
                  className="h-2 w-32 md:w-48 bg-gray-200"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-2 py-1.5 px-3 bg-gray-100 text-gray-800"
                >
                  <Clock size={14} />
                  <span>{formatTime(timer)}</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="flex items-center space-x-2 py-1.5 px-3 bg-green-100 text-green-800"
                >
                  <CheckCircle size={14} />
                  <span>{score} correct</span>
                </Badge>
              </div>
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
            <Card
              className={cn(
                "bg-white shadow-2xl transition-all duration-500 relative overflow-hidden",
                animateIn
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4",
              )}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-purple-600"></div>

              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-purple-800 border-purple-400 bg-purple-100"
                  >
                    Question {currentQuestionIndex + 1}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-center font-bold text-purple-900">
                  {currentQuestion?.quiz}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                {currentQuestion?.image && (
                  <div className="flex justify-center">
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 shadow-xl">
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
                      variant="outline"
                      size="lg"
                      className={cn(
                        "h-auto py-6 border-2 flex items-center justify-center text-lg font-medium transition-all duration-300",
                        getAnswerStyle(index),
                      )}
                      onClick={() => handleAnswerSelect(index)}
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
          <Card className="bg-white shadow-2xl max-w-lg mx-auto animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 ring-4 ring-purple-200">
                <Award size={40} className="text-purple-700" />
              </div>
              <div className="text-6xl font-bold mb-2">{getScoreEmoji()}</div>
              <CardTitle className="text-3xl font-bold text-purple-900">
                Quiz Completed!
              </CardTitle>
              <CardDescription className="text-purple-700 mt-2 text-lg">
                {getScoreDescription()}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4 text-center">
                  <p className="text-indigo-700 text-sm mb-1">Score</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {score}/{totalQuestions}
                  </p>
                  <p className="text-indigo-700 text-sm mt-1">
                    {Math.round((score / totalQuestions) * 100)}%
                  </p>
                </div>

                <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 text-center">
                  <p className="text-purple-700 text-sm mb-1">Time</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {formatTime(timer)}
                  </p>
                  <p className="text-purple-700 text-sm mt-1">
                    {Math.round(timer / totalQuestions)} sec/question
                  </p>
                </div>
              </div>

              <Separator className="my-6 bg-gray-300" />

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
                <Alert className="mt-6 bg-blue-100 border-blue-300 text-blue-800">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="ml-2">Results Submitted</AlertTitle>
                  <AlertDescription>
                    Your quiz results have been submitted successfully.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
