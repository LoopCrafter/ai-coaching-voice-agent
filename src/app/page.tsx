import {
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
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
