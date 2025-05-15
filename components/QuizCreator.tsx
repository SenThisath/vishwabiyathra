// components/QuizCreator.tsx
"use client";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Save, Trash2, Image as ImageIcon, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQuery } from "convex/react";

import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

interface Answer {
    answer: string;
    isCorrect: boolean;
}

interface QuizQuestion {
    quiz: string;
    image?: string;
    answers: Answer[];
}

export default function QuizCreator() {
    const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
    const [activeTab, setActiveTab] = useState<string>("create");
    const [showSavedAlert, setShowSavedAlert] = useState<boolean>(false);

    // New quiz state
    const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion>({
        quiz: "",
        image: "",
        answers: [
            { answer: "", isCorrect: false },
            { answer: "", isCorrect: false },
        ],
    });

    const addAnswer = () => {
        if (currentQuiz.answers.length < 6) {
            setCurrentQuiz({
                ...currentQuiz,
                answers: [
                    ...currentQuiz.answers,
                    { answer: "", isCorrect: false },
                ],
            });
        }
    };

    const updateAnswer = (
        index: number,
        field: keyof Answer,
        value: string | boolean
    ) => {
        const updatedAnswers = currentQuiz.answers.map((answer, i) => {
            if (i === index) {
                return { ...answer, [field]: value };
            }
            return answer;
        });

        setCurrentQuiz({
            ...currentQuiz,
            answers: updatedAnswers,
        });
    };

    const removeAnswer = (index: number) => {
        if (currentQuiz.answers.length > 2) {
            const updatedAnswers = currentQuiz.answers.filter(
                (_, i) => i !== index
            );
            setCurrentQuiz({
                ...currentQuiz,
                answers: updatedAnswers,
            });
        }
    };

    const handleQuizChange = (field: keyof QuizQuestion, value: string) => {
        setCurrentQuiz({
            ...currentQuiz,
            [field]: value,
        });
    };

    const addQuiz = () => {
        // Validate quiz
        if (!currentQuiz.quiz.trim()) {
            alert("Please add a quiz question");
            return;
        }

        if (!currentQuiz.answers.some((answer) => answer.isCorrect)) {
            alert("Please mark at least one answer as correct");
            return;
        }

        if (currentQuiz.answers.some((answer) => !answer.answer.trim())) {
            alert("Please fill in all answer fields");
            return;
        }

        // Add quiz to list
        setQuizzes([...quizzes, { ...currentQuiz }]);

        // Reset form
        setCurrentQuiz({
            quiz: "",
            image: "",
            answers: [
                { answer: "", isCorrect: false },
                { answer: "", isCorrect: false },
            ],
        });
    };

    const removeQuiz = (index: number) => {
        const updatedQuizzes = quizzes.filter((_, i) => i !== index);
        const updatedPreviousQuizzes = getPreviousSavedQuestions?.filter(
            (_, i) => i !== index
        );

        if (user && getSelectedSubjectOfTeacher) {
            saveQuiz({
                teacherId: user.id,
                subject: getSelectedSubjectOfTeacher,
                quizzes: updatedPreviousQuizzes || [],
            });
        }

        setQuizzes(updatedQuizzes);
    };

    const { user } = useUser();

    const getSelectedSubjectOfTeacher = useQuery(
        api.quizzes.getSelectedSubjectOfTeacher,
        user ? { teacherId: user.id } : "skip"
    );

    const saveQuiz = useMutation(api.quizzes.saveQuizzes);
    const getPreviousSavedQuestions = useQuery(
        api.quizzes.getPreviousSavedQuestions,
        user && getSelectedSubjectOfTeacher ?
            { teacherId: user.id, subject: getSelectedSubjectOfTeacher }
        :   "skip"
    );

    const saveQuizzes = async () => {
        if (user && getSelectedSubjectOfTeacher && quizzes.length > 0) {
            saveQuiz({
                teacherId: user.id,
                subject: getSelectedSubjectOfTeacher,
                quizzes: [...(getPreviousSavedQuestions || []), ...quizzes],
            });
            setShowSavedAlert(true);
            setQuizzes([]);
        }
    };

    const atLeastOneCorrectAnswer = currentQuiz.answers.some(
        (answer) => answer.isCorrect
    );

    console.log(getPreviousSavedQuestions);

    return (
        <div className="space-y-8">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="create">Create Quiz</TabsTrigger>
                    <TabsTrigger value="preview">
                        Preview ({quizzes.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Quiz Question</CardTitle>
                            <CardDescription>
                                Add a question and possible answers. Mark at
                                least one answer as correct.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="question">Question</Label>
                                <Textarea
                                    id="question"
                                    placeholder="Enter your quiz question here..."
                                    value={currentQuiz.quiz}
                                    onChange={(e) =>
                                        handleQuizChange("quiz", e.target.value)
                                    }
                                    className="min-h-24"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="image"
                                    className="flex items-center gap-2"
                                >
                                    <ImageIcon className="h-4 w-4" /> Optional
                                    Image URL
                                </Label>
                                <Input
                                    id="image"
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    value={currentQuiz.image || ""}
                                    onChange={(e) =>
                                        handleQuizChange(
                                            "image",
                                            e.target.value
                                        )
                                    }
                                />
                                {currentQuiz.image && (
                                    <div className="mt-2 border rounded-md p-2 bg-slate-50 dark:bg-slate-800">
                                        <p className="text-xs text-slate-500 mb-2">
                                            Image Preview:
                                        </p>
                                        <img
                                            src={currentQuiz.image}
                                            alt="Question preview"
                                            className="max-h-40 rounded"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    "https://placehold.co/400x200?text=Invalid+Image+URL";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>
                                        Answers (Mark at least one correct)
                                    </Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addAnswer}
                                        disabled={
                                            currentQuiz.answers.length >= 6
                                        }
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                        Answer
                                    </Button>
                                </div>

                                {currentQuiz.answers.map((answer, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="flex-1">
                                            <Input
                                                placeholder={`Answer option ${index + 1}`}
                                                value={answer.answer}
                                                onChange={(e) =>
                                                    updateAnswer(
                                                        index,
                                                        "answer",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`correct-${index}`}
                                                    checked={answer.isCorrect}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        updateAnswer(
                                                            index,
                                                            "isCorrect",
                                                            checked
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`correct-${index}`}
                                                    className="text-xs whitespace-nowrap"
                                                >
                                                    {answer.isCorrect ?
                                                        "Correct"
                                                    :   "Incorrect"}
                                                </Label>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    removeAnswer(index)
                                                }
                                                disabled={
                                                    currentQuiz.answers
                                                        .length <= 2
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {!atLeastOneCorrectAnswer && (
                                    <p className="text-sm text-red-500">
                                        Please mark at least one answer as
                                        correct
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCurrentQuiz({
                                        quiz: "",
                                        image: "",
                                        answers: [
                                            { answer: "", isCorrect: false },
                                            { answer: "", isCorrect: false },
                                        ],
                                    });
                                }}
                            >
                                Clear
                            </Button>
                            <Button onClick={addQuiz}>Add Quiz Question</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="preview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Preview</CardTitle>
                            <CardDescription>
                                Review your quiz questions before saving them to{" "}
                                {getSelectedSubjectOfTeacher}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {(
                                (!getPreviousSavedQuestions ||
                                    getPreviousSavedQuestions.length === 0) &&
                                quizzes.length === 0
                            ) ?
                                <div className="text-center py-8 text-slate-500">
                                    No quiz questions added yet. Create your
                                    first question in the Create Quiz tab.
                                </div>
                            :   <ScrollArea className="h-96 pr-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        {quizzes.map((quiz, quizIndex) => (
                                            <AccordionItem
                                                value={`quiz-${quizIndex}`}
                                                key={quizIndex}
                                            >
                                                <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-slate-800 px-4 -mx-4 rounded-md">
                                                    <div className="flex items-center gap-2 text-left">
                                                        <span className="font-semibold">
                                                            Q{quizIndex + 1}:
                                                        </span>
                                                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-xl">
                                                            {quiz.quiz}
                                                        </span>
                                                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                            Newly Added
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                                                        <p>{quiz.quiz}</p>

                                                        {quiz.image && (
                                                            <img
                                                                src={quiz.image}
                                                                alt="Question"
                                                                className="max-h-40 rounded my-2"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.onerror =
                                                                        null;
                                                                    e.currentTarget.src =
                                                                        "https://placehold.co/400x200?text=Invalid+Image+URL";
                                                                }}
                                                            />
                                                        )}

                                                        <div className="space-y-2">
                                                            <p className="font-medium">
                                                                Answers:
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {quiz.answers.map(
                                                                    (
                                                                        answer,
                                                                        answerIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                answerIndex
                                                                            }
                                                                            className={`p-2 rounded-md border ${
                                                                                (
                                                                                    answer.isCorrect
                                                                                ) ?
                                                                                    "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                                                :   "border-slate-200 dark:border-slate-700"
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                {answer.isCorrect && (
                                                                                    <Check className="h-4 w-4 text-green-500" />
                                                                                )}
                                                                                <span>
                                                                                    {
                                                                                        answer.answer
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between pt-2">
                                                            <Dialog>
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-1" />{" "}
                                                                        Remove
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            Remove
                                                                            Quiz
                                                                            Question
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            remove
                                                                            this
                                                                            quiz
                                                                            question?
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                e.stopPropagation()
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                removeQuiz(
                                                                                    quizIndex
                                                                                );
                                                                            }}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}

                                        {getPreviousSavedQuestions &&
                                            getPreviousSavedQuestions.length >
                                                0 &&
                                            getPreviousSavedQuestions.map(
                                                (quiz, quizIndex) => (
                                                    <AccordionItem
                                                        value={`quiz-${quizIndex}`}
                                                        key={quizIndex}
                                                    >
                                                        <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-slate-800 px-4 -mx-4 rounded-md">
                                                            <div className="flex items-center gap-2 text-left">
                                                                <span className="font-semibold">
                                                                    Q
                                                                    {quizIndex +
                                                                        1}
                                                                    :
                                                                </span>
                                                                <span className="text-slate-600 dark:text-slate-300 truncate max-w-xl">
                                                                    {quiz.quiz}
                                                                </span>
                                                                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                    Previously
                                                                    Added
                                                                </span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                                                                <p>
                                                                    {quiz.quiz}
                                                                </p>

                                                                {quiz.image && (
                                                                    <img
                                                                        src={
                                                                            quiz.image
                                                                        }
                                                                        alt="Question"
                                                                        className="max-h-40 rounded my-2"
                                                                        onError={(
                                                                            e
                                                                        ) => {
                                                                            e.currentTarget.onerror =
                                                                                null;
                                                                            e.currentTarget.src =
                                                                                "https://placehold.co/400x200?text=Invalid+Image+URL";
                                                                        }}
                                                                    />
                                                                )}

                                                                <div className="space-y-2">
                                                                    <p className="font-medium">
                                                                        Answers:
                                                                    </p>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {quiz.answers.map(
                                                                            (
                                                                                answer,
                                                                                answerIndex
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        answerIndex
                                                                                    }
                                                                                    className={`p-2 rounded-md border ${
                                                                                        (
                                                                                            answer.isCorrect
                                                                                        ) ?
                                                                                            "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                                                        :   "border-slate-200 dark:border-slate-700"
                                                                                    }`}
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        {answer.isCorrect && (
                                                                                            <Check className="h-4 w-4 text-green-500" />
                                                                                        )}
                                                                                        <span>
                                                                                            {
                                                                                                answer.answer
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between pt-2">
                                                                    <Dialog>
                                                                        <DialogTrigger
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    e.stopPropagation()
                                                                                }
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-1" />{" "}
                                                                                Remove
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>
                                                                                    Remove
                                                                                    Quiz
                                                                                    Question
                                                                                </DialogTitle>
                                                                                <DialogDescription>
                                                                                    Are
                                                                                    you
                                                                                    sure
                                                                                    you
                                                                                    want
                                                                                    to
                                                                                    remove
                                                                                    this
                                                                                    quiz
                                                                                    question?
                                                                                    This
                                                                                    action
                                                                                    cannot
                                                                                    be
                                                                                    undone.
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                            <DialogFooter>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        e.stopPropagation()
                                                                                    }
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();
                                                                                        removeQuiz(
                                                                                            quizIndex
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    Remove
                                                                                </Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </div>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )
                                            )}
                                    </Accordion>
                                </ScrollArea>
                            }
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={saveQuizzes}>
                                <Save className="h-4 w-4 mr-2" />
                                Save All Quizzes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            {showSavedAlert && (
                <Alert className="bg-green-100 dark:bg-green-900/20 border-green-500">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        Quizzes successfully saved to{" "}
                        {getSelectedSubjectOfTeacher}! You can now manage them
                        in your dashboard.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
