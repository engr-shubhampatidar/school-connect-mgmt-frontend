"use client";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-foreground">
          Page Not Found
        </h2>

        <p className="mt-3 max-w-md text-muted-foreground">
         {`Sorry, the page you are looking for doesn't exist or may have been
          moved.`}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            className="cursor-pointer"
            variant="dark"
            onClick={() => router.back()}
          >
           Go Back
          </Button>
        </div>
      </div>
    </main>
  );
}
