import { Navbar } from "@/components/layout";
import {
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  TestimonialsSection,
} from "@/components/sections";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      {/* <PricingSection />
    <FaqSection />
    <CtaSection />
    <Footer /> */}
    </main>
  );
}
