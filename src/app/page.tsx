import { Footer, Navbar } from "@/components/layout";
import {
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
  CtaSection,
} from "@/components/sections";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      {/* <CtaSection /> */}
      
    </main>
  );
}
