import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Schadensbilder from "@/components/sections/Schadensbilder";
import InjectionProcess from "@/components/sections/InjectionProcess";
import CostCalculator from "@/components/calculator/CostCalculator";
import RegionalPLZ from "@/components/sections/RegionalPLZ";
import TrustPartner from "@/components/sections/TrustPartner";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import GrokLeadBot from "@/components/ai/GrokLeadBot";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-sand-900 selection:bg-hydro-500 selection:text-white">
      {/* Sticky Glassmorphic Header */}
      <Navbar />

      <main>
        {/* Hero with Emergency Dial, Trust Proofs & Problem Paths */}
        <Hero />

        {/* ACCA-Style Service & Damage Carousel */}
        <Schadensbilder />

        {/* Interactive 3D Chemical Wall Injection Simulation & 4-Step Pipeline */}
        <InjectionProcess />

        {/* Interactive Cost & Savings Calculator */}
        <section id="kostenrechner" className="py-20 bg-sand-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <CostCalculator />
          </div>
        </section>

        {/* Regional Focus: Wuppertal, Schwebebahn, Solingen, Remscheid & PLZ 42 Checker */}
        <RegionalPLZ />

        {/* Official SchimmelPeter® Partner Certification & Inhaber Info */}
        <TrustPartner />

        {/* High-Converting Lead Generation Form with WhatsApp Fallback */}
        <ContactForm />

        {/* High-Intent SEO Accordion FAQ */}
        <FAQ />
      </main>

      {/* Polish ACCA-Styled Footer with Impressum & Privacy */}
      <Footer />

      {/* 24/7 Floating AI / Grok Diagnostic Bot */}
      <GrokLeadBot />
    </div>
  );
}
