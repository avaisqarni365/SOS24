import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Schadensbilder from "@/components/sections/Schadensbilder";
import InjectionProcess from "@/components/sections/InjectionProcess";
import ComplianceTrust from "@/components/sections/ComplianceTrust";
import CostCalculator from "@/components/calculator/CostCalculator";
import RegionalPLZ from "@/components/sections/RegionalPLZ";
import FAQ from "@/components/sections/FAQ";
import CtaBanner from "@/components/sections/CtaBanner";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/sections/Footer";
import ScrollSectionRail from "@/components/navigation/ScrollSectionRail";
import GrokLeadBot from "@/components/ai/GrokLeadBot";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-landing-ink font-sans antialiased text-landing-bone selection:bg-landing-mint selection:text-[#0E1310]">
      {/* 100% Kontai24 Minimalist Navbar */}
      <Navbar />

      {/* Floating Adaptive Side Navigation with Section Points & Pills */}
      <ScrollSectionRail />

      <main>
        {/* 1. TOP: Dark Forest Ink Hero + 3D Wireframe Orb + 4-Col Stat Grid */}
        <Hero />

        {/* 2. LEISTUNGEN: Snow White Bone Platform (3 Cards with Emerald Dots) */}
        <Schadensbilder />

        {/* 3. 3D-INJEKTION: Dark Forest Ink 3D Wall Injection Model + 4-Step Interactive Process */}
        <InjectionProcess />

        {/* 4. ZERTIFIZIERUNG: Soft Snow White Bone2 WTA & 10 Jahre Garantie Badges */}
        <ComplianceTrust />

        {/* 5. RECHNER: Snow White Bone Cost & Savings Calculator */}
        <CostCalculator />

        {/* 6. SERVICEGEBIET: Dark Forest Ink PLZ 42 Region Hub */}
        <RegionalPLZ />

        {/* 7. FAQ: Snow White Bone Accordion Q&A */}
        <FAQ />

        {/* 8. START: Dark Forest Ink Sofort-Diagnose Call to Action Banner */}
        <CtaBanner />

        {/* 9. KONTAKT: Snow White Bone2 Fast WhatsApp & Phone Channel */}
        <ContactForm />
      </main>

      {/* Minimalist Dark Forest Ink Footer */}
      <Footer />

      {/* 24/7 Sanierungs-Bot Widget */}
      <GrokLeadBot />
    </div>
  );
}
