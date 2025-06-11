"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AlertCircle,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  BrainCircuit,
  Trophy,
  Home,
  RefreshCw,
  BookOpen,
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
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definitions
interface Answer {
  answer: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  _id?: string;
  quiz: string;
  answers: Answer[];
  image?: string;
  subject?: string;
}

interface QuizResults {
  subject: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  date: string;
}

export default function QuizPage() {
  const router = useRouter();
  // const { user } = useUser();

  // State variables
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [feedbackShown, setFeedbackShown] = useState<boolean>(false);
  const [showFeedbackAlert, setShowFeedbackAlert] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [subjectSelected, setSubjectSelected] = useState<boolean>(false);
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(quizResults);

  // Fetch all available subjects from quizzes table
  const allQuizzes = useQuery(api.quizzes.getAllQuizzes);

  // Extract unique subjects
  const subjects = allQuizzes
    ? [
        ...new Set(
          allQuizzes.filter((quiz) => quiz.subject).map((quiz) => quiz.subject),
        ),
      ]
    : [];

  // Fetch quizzes for selected subject only
  const getQuizzesBySubject = useQuery(
    api.quizzes.getQuizzesBySubject,
    selectedSubject ? { subject: selectedSubject } : "skip",
  );

  // Type assertion to fix compatibility with QuizQuestion[] type
  const quizQuestions: QuizQuestion[] = (
    getQuizzesBySubject && subjectSelected
      ? getQuizzesBySubject.quizzes || []
      : []
  ) as QuizQuestion[];

  const totalQuestions: number = quizQuestions.length;
  const currentQuestion: QuizQuestion | undefined =
    quizQuestions[currentQuestionIndex];

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle subject selection
  const handleSubjectSelect = (subject: string): void => {
    setSelectedSubject(subject);
    setLoading(true);

    // Simulate loading data
    setTimeout(() => {
      setSubjectSelected(true);
      setLoading(false);
    }, 1000);
  };

  // Start quiz
  const startQuiz = (): void => {
    setQuizStarted(true);
    setAnimateIn(true);
    // Start timer after a short delay to allow for animation
    setTimeout(() => {
      setIsRunning(true);
    }, 500);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number): void => {
    if (feedbackShown || !currentQuestion) return; // Prevent selecting another answer during feedback

    setSelectedAnswer(answerIndex);
    setFeedbackShown(true);

    // Check if answer is correct
    const correct = currentQuestion.answers[answerIndex].isCorrect;
    setIsCorrect(correct);

    // Update score if answer is correct
    if (correct) {
      setScore((prevScore) => prevScore + 1);
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

          // Save results
          const results: QuizResults = {
            subject: selectedSubject,
            score: score + (correct ? 1 : 0),
            totalQuestions: totalQuestions,
            timeSpent: timer,
            date: new Date().toISOString(),
          };
          setQuizResults(results);

          // Log results to console
          console.log("Quiz Results:", results);
        }
      }, 300);
    }, 1500);
  };

  const getAnswerStyle = (index: number): string => {
    if (!feedbackShown) {
      return "bg-white text-purple-900 hover:bg-purple-100 hover:border-purple-500 hover:shadow-xl";
    }

    if (currentQuestion?.answers[index].isCorrect) {
      return "bg-green-600 hover:bg-green-600 text-white border-green-700";
    }

    if (
      selectedAnswer === index &&
      !currentQuestion?.answers[index].isCorrect
    ) {
      return "bg-red-600 hover:bg-red-600 text-white border-red-700";
    }

    return "opacity-60";
  };

  const getScoreDescription = (): string => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "Genius Level!";
    if (percentage >= 75) return "Outstanding!";
    if (percentage >= 60) return "Good job!";
    if (percentage >= 40) return "Not bad!";
    return "Better luck next time!";
  };

  const getScoreEmoji = (): string => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "🏆";
    if (percentage >= 75) return "🎯";
    if (percentage >= 60) return "🎉";
    if (percentage >= 40) return "👍";
    return "🌱";
  };

  // Handle navigation back to subjects page
  const handleBackToSubjects = (): void => {
    router.push("/subjects");
  };


  // Handle reset subject selection
  const handleResetSubjectSelection = (): void => {
    setSelectedSubject("");
    setSubjectSelected(false);
    setQuizStarted(false);
    setScore(0);
    setTimer(0);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <RefreshCw size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Loading quiz...
          </h2>
          <p className="text-purple-200">
            Please wait while we prepare your questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/api/placeholder/2000/2000')] opacity-5 mix-blend-soft-light pointer-events-none"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {!subjectSelected ? (
          // Subject Selection Screen
          <Card className="bg-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

            <CardHeader className="text-center pb-2 relative">
              <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-6 ring-4 ring-purple-200">
                <BookOpen size={40} className="text-purple-700" />
              </div>
              <CardTitle className="text-4xl font-bold tracking-tight text-purple-900">
                Select Subject
              </CardTitle>
              <CardDescription className="text-purple-700 mt-2 text-lg">
                Choose a subject to start the quiz
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 pb-6">
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="px-4 py-3 rounded-lg bg-purple-50">
                  <Select onValueChange={handleSubjectSelect}>
                    <SelectTrigger className="w-full h-12 text-lg border-purple-300">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject, index) => (
                        <SelectItem key={index} value={subject as string}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-gray-700 text-center">
                  Select from available subjects to begin your quiz journey.
                  Each subject contains a unique set of questions to test your
                  knowledge.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-8 px-8">
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 mr-4"
                onClick={handleBackToSubjects}
              >
                <Home size={16} className="mr-2" />
                Back to Subjects
              </Button>
            </CardFooter>
          </Card>
        ) : !quizStarted ? (
          // Welcome Screen for selected subject
          <Card className="bg-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

            <CardHeader className="text-center pb-2 relative">
              <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-6 ring-4 ring-purple-200">
                <BrainCircuit size={40} className="text-purple-700" />
              </div>
              <CardTitle className="text-4xl font-bold tracking-tight text-purple-900">
                {selectedSubject} Quiz
              </CardTitle>
              <CardDescription className="text-purple-700 mt-2 text-lg">
                Test your knowledge in {selectedSubject}
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
                    {quizQuestions.length} Questions
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
                    Score Tracking
                  </Badge>
                </div>

                <p className="text-gray-700">
                  Are you ready to challenge yourself? This quiz will test your
                  knowledge about {selectedSubject}. Answer all questions
                  correctly to earn a high score!
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pb-8 px-8">
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={handleResetSubjectSelection}
              >
                <ArrowRight size={16} className="mr-2 rotate-180" />
                Change Subject
              </Button>

              {quizQuestions.length === 0 ? (
                <Button
                  disabled
                  className="px-8 py-6 text-lg font-semibold bg-gray-400 text-white cursor-not-allowed"
                >
                  No Questions Available
                </Button>
              ) : (
                <Button
                  size="lg"
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
              )}
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
                  value={((currentQuestionIndex + 1) / totalQuestions) * 100}
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
                    : `The correct answer was: ${currentQuestion?.answers.find((a) => a.isCorrect)?.answer}`}
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
                  </CardContent>
                  
          </Card>
        )}
      </div>
    </div>
  );
}
