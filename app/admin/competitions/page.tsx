"use client";

import {
  Dialog,
  DialogClose,
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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

const Competitions = () => {
  const formSchema = z.object({
    name: z.string({ required_error: "Please enter competition name." }),
    description: z.string({ required_error: "Please enter description." }),
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
      isTeam: false,
      startTime: undefined,
      endTime: undefined,
    },
  });

  const insertCompetition = useMutation(api.competitions.insertCompetition);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newValues = {
      ...values,
      startTime: values.startTime.getTime(),
      endTime: values.endTime.getTime(),
    };
    insertCompetition(Object(newValues));
  }

  const registrations = useQuery(
    api.competitions.getRegistrationsWithCompetitionDetails,
  );
  const deleteInterReg = useMutation(api.competitions.deleteInterRegistration);
  const deleteIntraReg = useMutation(api.competitions.deleteIntraRegistration);
  const updateIntraReg = useMutation(api.competitions.updateIntraRegistration);

  const [editingIntra, setEditingIntra] = useState<Id<"intra"> | null>(null);
  const [intraFormData, setIntraFormData] = useState({
    fullName: "",
    admissionNumber: 0,
    grade: 0,
    cls: "",
    whatsAppNumber: 0,
  });

  const handleDeleteInter = async (registrationId: Id<"reservations">) => {
    try {
      await deleteInterReg({ registrationId: registrationId });
    } catch (error) {
      console.error("Error deleting inter registration:", error);
    }
  };

  const handleDeleteIntra = async (registrationId: string) => {
    try {
      await deleteIntraReg({ registrationId: registrationId as Id<"intra"> });
    } catch (error) {
      console.error("Error deleting intra registration:", error);
    }
  };

  const handleUpdateIntra = async () => {
    if (!editingIntra) return;
    try {
      await updateIntraReg({
        registrationId: editingIntra,
        fullName: intraFormData.fullName,
        admissionNumber: intraFormData.admissionNumber,
        grade: intraFormData.grade,
        cls: intraFormData.cls,
        whatsAppNumber: intraFormData.whatsAppNumber,
      });
      setEditingIntra(null);
    } catch (error) {
      console.error("Error updating intra registration:", error);
    }
  };

  if (!registrations) {
    return <div>Loading registrations...</div>;
  }

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        Check if this competition is a team competition.
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
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
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
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
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
      <div className="space-y-6">
        {/* Inter Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Inter Registrations (Team-based)
              <Badge variant="secondary">{registrations.inter.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competition</TableHead>
                  <TableHead>Team Leader</TableHead>
                  <TableHead>Team Members</TableHead>
                  <TableHead>Team Marks</TableHead>
                  <TableHead>Project Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.inter.map((registration) => {
                  // Find corresponding inter record for marks and project link
                  const interRecord = registrations.inter.find(
                    (r) => r._id === registration._id,
                  );

                  return (
                    <TableRow key={registration._id}>
                      <TableCell className="font-medium">
                        {registration.competitionName}
                      </TableCell>
                      <TableCell>{registration?.teamLeader?.name}</TableCell>
                      <TableCell>
                        {registration.teamMembers?.length ? (
                          <div className="space-y-1">
                            {registration.teamMembers.map((member, index) => (
                              <div key={index} className="text-sm">
                                {member.user} ({member.subject})
                              </div>
                            ))}
                          </div>
                        ) : (
                          "No members"
                        )}
                      </TableCell>
                      <TableCell>
                        {interRecord?.teamMarks?.length ? (
                          <div className="space-y-1">
                            {interRecord.teamMarks.map((mark, index) => (
                              <div key={index} className="text-sm">
                                <strong>{mark.user}</strong> ({mark.subject}):{" "}
                                {mark.marks}
                                <div className="text-xs text-gray-500">
                                  {new Date(mark.time).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No marks yet</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {interRecord?.projectLink ? (
                          <a
                            href={interRecord.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Project
                          </a>
                        ) : (
                          <span className="text-gray-500">No link</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Registration
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this inter
                                registration? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  registration.reservationId &&
                                  registration.teamLeader &&
                                  handleDeleteInter(registration.reservationId)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {registrations.inter.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No inter registrations found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Intra Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Intra Registrations (Individual-based)
              <Badge variant="secondary">{registrations.intra.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competition</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Admission Number</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Subject Marks</TableHead>
                  <TableHead>Project Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.intra.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell className="font-medium">
                      {registration.competitionName}
                    </TableCell>
                    <TableCell>{registration.fullName}</TableCell>
                    <TableCell>{registration.admissionNumber}</TableCell>
                    <TableCell>{registration.grade}</TableCell>
                    <TableCell>{registration.cls}</TableCell>
                    <TableCell>{registration.whatsAppNumber}</TableCell>
                    <TableCell>
                      {registration.subjectMarks?.length ? (
                        <div className="space-y-1">
                          {registration.subjectMarks.map((mark, index) => (
                            <div key={index} className="text-sm">
                              <strong>{mark.subject}</strong>: {mark.marks}
                              <div className="text-xs text-gray-500">
                                {new Date(mark.time).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No marks yet</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {registration.projectLink ? (
                        <a
                          href={registration.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Project
                        </a>
                      ) : (
                        <span className="text-gray-500">No link</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Registration
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this intra
                                registration for {registration.fullName}? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteIntra(registration._id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Dialog>
                          <DialogTrigger
                            onClick={() => {
                              setIntraFormData(registration);
                              setEditingIntra(registration._id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                value={intraFormData.fullName}
                                onChange={(e) =>
                                  setIntraFormData({
                                    ...intraFormData,
                                    fullName: e.target.value,
                                  })
                                }
                                placeholder="Full Name"
                              />
                              <Input
                                type="number"
                                value={intraFormData.admissionNumber}
                                onChange={(e) =>
                                  setIntraFormData({
                                    ...intraFormData,
                                    admissionNumber: parseInt(e.target.value),
                                  })
                                }
                                placeholder="Admission Number"
                              />
                              <Input
                                type="number"
                                value={intraFormData.grade}
                                onChange={(e) =>
                                  setIntraFormData({
                                    ...intraFormData,
                                    grade: parseInt(e.target.value),
                                  })
                                }
                                placeholder="Grade"
                              />
                              <Input
                                value={intraFormData.cls}
                                onChange={(e) =>
                                  setIntraFormData({
                                    ...intraFormData,
                                    cls: e.target.value,
                                  })
                                }
                                placeholder="Class"
                              />
                              <Input
                                type="number"
                                value={intraFormData.whatsAppNumber}
                                onChange={(e) =>
                                  setIntraFormData({
                                    ...intraFormData,
                                    whatsAppNumber: parseInt(e.target.value),
                                  })
                                }
                                placeholder="WhatsApp Number"
                              />
                              <div className="flex justify-end">
                                <DialogClose asChild>
                                  <Button onClick={handleUpdateIntra}>
                                    Save
                                  </Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {registrations.intra.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No intra registrations found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Competitions;
