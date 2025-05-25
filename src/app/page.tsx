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
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      {/* <CtaSection /> */}
    </div>
  );
}
