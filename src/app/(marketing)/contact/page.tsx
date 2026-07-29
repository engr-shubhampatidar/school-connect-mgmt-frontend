import AksharNav from "@/components/public/landing/AksharNav";
import LandingFooter from "@/components/public/landing/LandingFooter";
import { ContactPageContent } from "@/modules/contact";

export const metadata = {
  title: "Contact — Akshar",
  description: "Talk to the Akshar team about onboarding, support, or partnerships.",
};

export default function ContactPage() {
  return (
    <>
      <AksharNav />
      <main>
        <ContactPageContent />
      </main>
      <LandingFooter />
    </>
  );
}
