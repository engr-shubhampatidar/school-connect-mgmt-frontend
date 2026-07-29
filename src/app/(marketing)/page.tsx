import AksharNav from "@/components/public/landing/AksharNav";
import LandingHero from "@/components/public/landing/LandingHero";
import LandingSchools from "@/components/public/landing/LandingSchools";
import LandingProduct from "@/components/public/landing/LandingProduct";
import LandingCapabilities from "@/components/public/landing/LandingCapabilities";
import LandingRoles from "@/components/public/landing/LandingRoles";
import LandingCta from "@/components/public/landing/LandingCta";
import LandingFooter from "@/components/public/landing/LandingFooter";

export const metadata = {
  title: "Akshar — School operating system for every campus",
  description:
    "Akshar is a multi-school institute management platform for admins, teachers, and students.",
};

export default function HomePage() {
  return (
    <>
      <AksharNav />
      <main>
        <LandingHero />
        <LandingSchools />
        <LandingProduct />
        <LandingCapabilities />
        <LandingRoles />
        <LandingCta />
      </main>
      <LandingFooter />
    </>
  );
}
