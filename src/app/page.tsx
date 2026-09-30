import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Schadensbilder from "@/components/sections/Schadensbilder";
import InjectionProcess from "@/components/sections/InjectionProcess";
import CostCalculator from "@/components/calculator/CostCalculator";
import RegionalPLZ from "@/components/sections/RegionalPLZ";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import GrokLeadBot from "@/components/ai/GrokLeadBot";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Minimalist Kontai24 Header */}
      <Navbar />

      <main>
        {/* Kontai24 Hero: "Gedichtet. Injiziert. Getrocknet. Dauerhaft." */}
        <Hero />

        {/* Kontai24 3-Card Platform Grid: Mauerwerk, Keller, Schimmel */}
        <Schadensbilder />

        {/* 3D Exploded-Layer Injektionsverfahren & 4-Step Pipeline */}
        <InjectionProcess />

        {/* Cost & Savings Calculator */}
        <section id="rechner" className="py-24 bg-[#0b0e14] border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <CostCalculator />
          </div>
        </section>

        {/* Regional Focus: Wuppertal, Solingen, Remscheid & PLZ 42 Checker */}
        <RegionalPLZ />

        {/* High-Intent SEO FAQ */}
        <FAQ />

        {/* Minimalist Contact Section & Direct WhatsApp Channel */}
        <ContactForm />
      </main>

      {/* Kontai24 Minimalist Footer */}
      <Footer />

      {/* 24/7 Dark Cyber AI Diagnostic Bot */}
      <GrokLeadBot />
    </div>
  );
}
