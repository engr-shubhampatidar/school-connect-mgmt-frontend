import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustedBy from "@/components/sections/TrustedBy";
import DashboardTabs from "@/components/sections/DashboardTabs";
import FeatureHighlight from "@/components/sections/FeatureHighlight";
import StatsSection from "@/components/sections/StatsSection";
import BenefitsSection from "@/components/sections/BenefitsSection";

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      <Header />

      <main>
        <HeroSection />
        <TrustedBy />
        <DashboardTabs />
        <FeatureHighlight />
        <StatsSection />
        <BenefitsSection />
      </main>

      <Footer />
    </div>
  );
}
