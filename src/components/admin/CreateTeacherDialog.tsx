"use client";
// import React, { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import type { Resolver } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import Button from "../ui/Button";
// import Card from "../ui/Card";
// import { useToast } from "../ui/use-toast";
// import API from "@/lib/axios";
// import { ADMIN_API } from "@/lib/api-routes";
// import { fetchClassesWithTeacher, ClassWithTeacher } from "@/lib/adminApi";
import CreateTeacherForm from "../CreateTeacherForm";

// const assignmentSchema = z.object({
//   classId: z.string().min(1, "Class is required"),
//   subjectId: z.string().optional(),
// });

// const createTeacherSchema = z
//   .object({
//     fullName: z.string().min(2, "Full name must be at least 2 characters"),
//     email: z.string().email("Must be a valid email"),
//     phone: z
//       .string()
//       .optional()
//       .transform((v) => (v ? v.trim() : undefined)),
//     subjects: z.array(z.string()).optional(), // subject ids
//     isClassTeacher: z.boolean().optional(),
//     classTeacher: z.string().optional(),
//     assignClassSubjects: z.array(assignmentSchema).optional(),
//   })
//   .superRefine((val, ctx) => {
//     const subjectSet = new Set(val.subjects ?? []);
//     const seen = new Set<string>();
//     (val.assignClassSubjects ?? []).forEach((a, idx) => {
//       if (a.subjectId && !subjectSet.has(a.subjectId)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: `Assigned subject must be one of selected specialties`,
//           path: ["assignClassSubjects", idx, "subjectId"],
//         });
//       }
//       const key = `${a.classId}::${a.subjectId ?? ""}`;
//       if (seen.has(key)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: `Duplicate assignment for class and subject`,
//           path: ["assignClassSubjects", idx],
//         });
//       }
//       seen.add(key);
//     });
//     if (val.isClassTeacher && val.classTeacher && val.assignClassSubjects) {
//       // it's allowed, but ensure selected class exists in assignments? not needed
//     }
//   });

// type CreateTeacherValues = z.input<typeof createTeacherSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  // optional subjects provided by parent to avoid duplicate API calls
  subjectsProp?: { id: string; name: string }[];
};

export default function CreateTeacherDialog({
  open,
  onClose,
  onCreated,
  // subjectsProp,
}: Props) {
  // const { toast } = useToast();
  // // const [loading, setLoading] = useState(false);
  // const [classes, setClasses] = useState<
  //   { id: string; name: string; disabled?: boolean }[]
  // >([]);
  // const [classesWithTeacher, setClassesWithTeacher] = useState<
  //   ClassWithTeacher[]
  // >([]);
  // const [classesLoading, setClassesLoading] = useState(false);
  // const [classesError, setClassesError] = useState<string | null>(null);
  // const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  // const [tempEmail, setTempEmail] = useState<string | null>(null);
  // const [tempPassword, setTempPassword] = useState<string | null>(null);

  // const form = useForm<CreateTeacherValues>({
  //   resolver: zodResolver(createTeacherSchema) as Resolver<CreateTeacherValues>,
  //   defaultValues: {
  //     fullName: "",
  //     email: "",
  //     phone: "",
  //     subjects: [],
  //     isClassTeacher: false,
  //     classTeacher: undefined,
  //     assignClassSubjects: [],
  //   },
  // });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "assignClassSubjects",
  // });

  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     // fetch classes-with-teacher separately so it doesn't block whole form
  //     setClassesLoading(true);
  //     setClassesError(null);
  //     try {
  //       // If parent provided subjects, use them and only fetch classes.
  //       if (subjectsProp && Array.isArray(subjectsProp)) {
  //         setSubjects(subjectsProp);
  //         const fetched = await fetchClassesWithTeacher();
  //         if (!mounted) return;
  //         setClassesWithTeacher(fetched || []);
  //         if (!Array.isArray(fetched) || fetched.length === 0) {
  //           setClasses([
  //             { id: "", name: "No classes available", disabled: true },
  //           ]);
  //         } else {
  //           const opts = fetched.map((c) => {
  //             const label = c.classSection
  //               ? `${c.className} - ${c.classSection}`
  //               : c.className;
  //             return {
  //               id: c.classId,
  //               name: c.classTeacher
  //                 ? `${label} — Assigned to ${c.classTeacher.fullName}`
  //                 : label,
  //               disabled: Boolean(c.classTeacher),
  //             };
  //           });
  //           setClasses(opts);
  //         }
  //       } else {
  //         // no subjects provided: fetch subjects and classes as before
  //         const [sRes, classesArr] = await Promise.allSettled([
  //           API.get(ADMIN_API.SUBJECTS),
  //           fetchClassesWithTeacher(),
  //         ]);

  //         if (!mounted) return;

  //         // subjects
  //         if (sRes.status === "fulfilled") {
  //           const sdata = (sRes.value as { data: unknown }).data;
  //           const normalize = (arr: unknown[]) =>
  //             arr.map((it) => {
  //               if (it && typeof it === "object") {
  //                 const o = it as Record<string, unknown>;
  //                 return {
  //                   id: String(
  //                     o.id ??
  //                       o._id ??
  //                       o.uuid ??
  //                       o.value ??
  //                       o.key ??
  //                       o.name ??
  //                       "",
  //                   ),
  //                   name: String(o.name ?? o.title ?? o.value ?? ""),
  //                 };
  //               }
  //               return { id: String(it ?? ""), name: String(it ?? "") };
  //             });
  //           setSubjects(
  //             Array.isArray(sdata)
  //               ? normalize(sdata as unknown[])
  //               : Array.isArray((sdata as Record<string, unknown>).items)
  //                 ? normalize(
  //                     (sdata as Record<string, unknown>).items as unknown[],
  //                   )
  //                 : [],
  //           );
  //         } else {
  //           setSubjects([]);
  //         }

  //         // classes
  //         if (classesArr.status === "fulfilled") {
  //           const fetched = classesArr.value as ClassWithTeacher[];
  //           setClassesWithTeacher(fetched || []);
  //           if (!Array.isArray(fetched) || fetched.length === 0) {
  //             setClasses([
  //               { id: "", name: "No classes available", disabled: true },
  //             ]);
  //           } else {
  //             const opts = fetched.map((c) => {
  //               const label = c.classSection
  //                 ? `${c.className} - ${c.classSection}`
  //                 : c.className;
  //               return {
  //                 id: c.classId,
  //                 name: c.classTeacher
  //                   ? `${label} — Assigned to ${c.classTeacher.fullName}`
  //                   : label,
  //                 disabled: Boolean(c.classTeacher),
  //               };
  //             });
  //             setClasses(opts);
  //           }
  //         } else {
  //           setClasses([]);
  //           setClassesError("Unable to load classes. Please try again.");
  //         }
  //       }
  //     } catch (err) {
  //       if (!mounted) return;
  //       setClasses([]);
  //       setSubjects([]);
  //       setClassesError("Unable to load classes. Please try again.");
  //     } finally {
  //       if (mounted) setClassesLoading(false);
  //     }
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [subjectsProp]);

  // const onSubmit = async (values: CreateTeacherValues) => {
  //   // prevent assigning to already-assigned classes
  //   if (values.isClassTeacher && values.classTeacher) {
  //     const c = classesWithTeacher.find(
  //       (x) => x.classId === values.classTeacher,
  //     );
  //     if (c && c.classTeacher) {
  //       form.setError("classTeacher" as any, {
  //         type: "validation",
  //         message: `Selected class is already assigned to ${c.classTeacher.fullName}`,
  //       });
  //       toast({
  //         title: "Cannot assign class",
  //         description: `Selected class is already assigned to ${c.classTeacher.fullName}`,
  //         type: "error",
  //       });
  //       return;
  //     }
  //   }
  //   // ensure assignClassSubjects don't pick assigned classes
  //   const badAssign = (values.assignClassSubjects ?? []).find(
  //     (a) =>
  //       !!classesWithTeacher.find(
  //         (x) => x.classId === a.classId && x.classTeacher,
  //       ),
  //   );
  //   if (badAssign) {
  //     form.setError("assignClassSubjects" as any, {
  //       type: "validation",
  //       message:
  //         "One or more selected classes are already assigned to another teacher",
  //     });
  //     toast({
  //       title: "Cannot assign class",
  //       description:
  //         "One or more selected classes are already assigned to another teacher",
  //       type: "error",
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       fullName: values.fullName,
  //       name: values.fullName,
  //       email: values.email,
  //       phone: values.phone ?? undefined,
  //       subjects: values.subjects ?? [],
  //       classTeacher: values.isClassTeacher
  //         ? (values.classTeacher ?? undefined)
  //         : undefined,
  //       assignClassSubjects: (values.assignClassSubjects ?? []).map((a) => ({
  //         classId: a.classId,
  //         subjectId: a.subjectId ?? undefined,
  //       })),
  //     };

  //     const resp = await API.post(ADMIN_API.TEACHERS, payload);

  //     toast({ title: "Teacher created", type: "success" });
  //     form.reset();
  //     // notify parent to refresh
  //     onCreated?.();

  //     // show temporary credentials if backend returned them
  //     const data = resp.data as
  //       | {
  //           id?: string;
  //           userId?: string;
  //           email?: string;
  //           temporaryPassword?: string;
  //           message?: string;
  //         }
  //       | undefined;

  //     const email = data?.email ?? null;
  //     const pw = data?.temporaryPassword ?? null;

  //     if (typeof email === "string" && email.length > 0) {
  //       setTempEmail(email);
  //     }
  //     if (typeof pw === "string" && pw.length > 0) {
  //       setTempPassword(pw);
  //     }

  //     if (!email && !pw) {
  //       // nothing to show
  //       onClose();
  //     }
  //   } catch (err: unknown) {
  //     if (axios.isAxiosError(err)) {
  //       const data = err.response?.data as Record<string, unknown> | undefined;
  //       if (data?.fieldErrors && typeof data.fieldErrors === "object") {
  //         const fe = data.fieldErrors as Record<string, unknown>;
  //         Object.entries(fe).forEach(([k, v]) => {
  //           const field = (
  //             k === "name" ? "fullName" : k
  //           ) as keyof CreateTeacherValues;
  //           try {
  //             form.setError(field as unknown as keyof CreateTeacherValues, {
  //               type: "server",
  //               message: String(v),
  //             });
  //           } catch {}
  //         });
  //       }
  //       toast({
  //         title: "Failed to create teacher",
  //         description: (data && (data.message as string)) ?? err.message,
  //         type: "error",
  //       });
  //     } else if (err instanceof Error) {
  //       toast({
  //         title: "Failed to create teacher",
  //         description: err.message,
  //         type: "error",
  //       });
  //     } else {
  //       toast({ title: "Failed to create teacher", type: "error" });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const classOptions = classesLoading
  //   ? [{ id: "", name: "Loading classes...", disabled: true }]
  //   : classes.length === 0
  //     ? [
  //         {
  //           id: "",
  //           name: classesError ?? "No classes available",
  //           disabled: true,
  //         },
  //       ]
  //     : classes;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-[777px] p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
          <div className="rounded-lg">
            <div className=" min-h-full">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Create New Teacher
                  </h3>
                  <p className="text-[14px] font-[400] text-white">
                    Fill in the details below to add a new teacher to the
                    system.
                  </p>
                </div>
                <div>
                  <button
                    aria-label="close"
                    onClick={onClose}
                    className="text-white hover:text-white/80"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-[16px] bg-white overflow-hidden no-scrollbar rounded-b-lg max-h-full overflow-y-auto">
                <CreateTeacherForm
                  onClose={onClose}
                  onCreated={() => {
                    onCreated?.();
                    // onClose();
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* {tempEmail || tempPassword ? (
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative w-full max-w-md p-4">
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Temporary Credentials
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Share these credentials with the teacher — they will not
                      be shown again.
                    </p>
                  </div>
                  <div>
                    <button
                      aria-label="close"
                      onClick={() => {
                        setTempEmail(null);
                        setTempPassword(null);
                        onClose();
                      }}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="rounded-md border p-4">
                    <div className="text-sm text-slate-700">Email</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="font-mono text-lg text-slate-900">
                        {tempEmail ?? "-"}
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            const parts: string[] = [];
                            if (tempEmail) parts.push(`Email: ${tempEmail}`);
                            if (tempPassword)
                              parts.push(`Temporary Password: ${tempPassword}`);
                            const toCopy = parts.join("\n");
                            try {
                              await navigator.clipboard.writeText(toCopy);
                              toast({
                                title: "Copied to clipboard",
                                type: "success",
                              });
                            } catch {
                              toast({ title: "Copy failed", type: "error" });
                            }
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {tempPassword ? (
                      <>
                        <div className="mt-4 text-sm text-slate-700">
                          Temporary Password
                        </div>
                        <div className="mt-2 font-mono text-lg text-slate-900">
                          {tempPassword}
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        setTempEmail(null);
                        setTempPassword(null);
                        onClose();
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        try {
                          window.open(
                            "/login",
                            "_blank",
                            "noopener,noreferrer",
                          );
                        } catch {}
                      }}
                    >
                      Go to Teacher Login
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : null} */}
      </div>
    </>
  );
}
