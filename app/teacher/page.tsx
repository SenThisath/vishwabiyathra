"use client";

import QuizCreator from "@/components/QuizCreator";
import SubjectSelection from "@/components/SubjectSelection";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const TeachersPage = () => {
    const { user } = useUser();

    const getSelectedSubjectOfTeacher = useQuery(
        api.quizzes.getSelectedSubjectOfTeacher,
        user ? { teacherId: user.id } : "skip"
    );

    console.log(getSelectedSubjectOfTeacher);
    return (
        <main className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
                    Teacher Quiz Creator
                </h1>

                {getSelectedSubjectOfTeacher === null ?
                    <SubjectSelection /> 
                :   getSelectedSubjectOfTeacher && (
                        <div>
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                                    Create Quizzes for{" "}
                                    {getSelectedSubjectOfTeacher}
                                </h2>
                            </div>
                            <QuizCreator />
                        </div>
                    )
                }

                {/* {!selectedSubject ?
                    
                :   
                } */}
            </div>
        </main>
    );
};

export default TeachersPage;
