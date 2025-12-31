import BenefitPage from "@/components/public/BenefitPage";
import HeroPage from "@/components/public/HeroPage";
import MainPage from "@/components/public/MainPage";
import Navbar from "@/components/public/Navbar";
import OurSolutions from "@/components/public/OurSolutions";
import Testimonals from "@/components/public/Testimonals";
import Pricing from "@/components/public/Pricing";
import QuickSupport from "@/components/public/QuickSupport";
import Footer from "@/components/public/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="px-24">
        <HeroPage />
        <MainPage />
        <BenefitPage />
        <OurSolutions />
      </main>

      <Testimonals />
      <div className="bg-gradient-to-b from-[#D7E3FC]/100 to-[#D7E3FC]/0">
        <Pricing />
        <QuickSupport />
      </div>
      <div className="">
        <Footer />
      </div>
    </>
  );
}
