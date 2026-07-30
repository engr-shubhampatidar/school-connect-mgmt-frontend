import { redirect } from "next/navigation";

/** Legacy path — Akshar marketing home now lives at `/`. */
export default function LegacyLandingRedirect() {
  redirect("/");
}
