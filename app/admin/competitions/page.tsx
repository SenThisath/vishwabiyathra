"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";

const Competitions = () => {
    const formSchema = z.object({
        name: z.string({ required_error: "Please enter competition name." }),
        description: z.string({ required_error: "Please enter description." }),
        img: z.string({ required_error: "Please enter image link." }),
        isTeam: z.boolean(),
        startTime: z
            .date({ required_error: "Date must be selected." })
            .refine((date) => date > new Date(), {
                message: "Date must be in the past.",
            }),
        endTime: z
            .date({ required_error: "Date must be selected." })
            .refine((date) => date > new Date(), {
                message: "Date must be in the past.",
            }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            description: undefined,
            img: undefined,
            isTeam: false,
            startTime: undefined,
            endTime: undefined,
        },
    });

    
    function onSubmit(values: z.infer<typeof formSchema>) {
        const newValues = {
            ...values,
            startTime: values.startTime.getTime(),
            endTime: values.endTime.getTime(),
        };
        insertCompetition(Object(newValues));
    }

    const insertCompetition = useMutation(api.competitions.insertCompetition);
    
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Competition</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Competition</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="img"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Link</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isTeam"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Check if this competition is a
                                                team competition.
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ?
                                                            new Date(
                                                                e.target.value
                                                            )
                                                        :   null
                                                    )
                                                }
                                                value={
                                                    field.value ?
                                                        new Date(field.value)
                                                            .toISOString()
                                                            .split("T")[0]
                                                    :   ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ?
                                                            new Date(
                                                                e.target.value
                                                            )
                                                        :   null
                                                    )
                                                }
                                                value={
                                                    field.value ?
                                                        new Date(field.value)
                                                            .toISOString()
                                                            .split("T")[0]
                                                    :   ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Competitions;
