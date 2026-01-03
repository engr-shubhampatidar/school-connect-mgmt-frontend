"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import loginConfig, { type Role } from "../../lib/loginConfig";
import Form, {
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useToast } from "../ui/use-toast";

type Props = {
  defaultRole?: Role;
};

export default function UnifiedLoginForm({ defaultRole = "admin" }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = React.useState<Role>(defaultRole);

  // schema can be unknown, cast to any for resolver invocation
  const schema: any = (loginConfig as any)[role].schema;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });

  React.useEffect(() => {
    // reset when role changes to avoid cross-field errors
    form.reset();
  }, [role]);

  const onSubmit = async (values: any) => {
    try {
      await (loginConfig as any)[role].submit(values);
      toast({
        title: "Logged in",
        description: "Redirecting...",
        type: "success",
      });
      router.push((loginConfig as any)[role].redirectPath);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const resp = (err as any).response?.data;
        if (resp && typeof resp === "object") {
          if (resp.errors && typeof resp.errors === "object") {
            Object.entries(resp.errors).forEach(([key, value]) => {
              form.setError(key as any, {
                type: "server",
                message: String(value),
              });
            });
            toast({
              title: "Validation error",
              description: "Please fix the form errors.",
              type: "error",
            });
            return;
          }
          const message = resp.message || resp.error || JSON.stringify(resp);
          toast({
            title: "Login failed",
            description: String(message),
            type: "error",
          });
          return;
        }
      }
      const message = (err as any)?.message ?? "Unable to login";
      toast({
        title: "Login failed",
        description: String(message),
        type: "error",
      });
    }
  };

  const cfg = (loginConfig as any)[role];

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{cfg.title}</h2>
            <p className="text-sm text-slate-500">School Management System</p>
          </div>
        </div>

        <Form onSubmit={form.handleSubmit(onSubmit)}>
          {cfg.fields.map((f: any) => (
            <FormField key={f.name}>
              <FormLabel>{f.label}</FormLabel>
              <FormMessage>
                {form.formState.errors?.[f.name]?.message as React.ReactNode}
              </FormMessage>
              <FormControl>
                <Input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  {...form.register(f.name)}
                />
              </FormControl>
            </FormField>
          ))}

          <div className="mt-4">
            <Button
              type="submit"
              className="w-full bg-[#021034]"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
