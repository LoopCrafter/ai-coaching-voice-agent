"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Headphones, Brain, MessageSquare } from "lucide-react";
import { motion, useInView } from "@/lib/motion";

const steps = [
  {
    icon: <Mic className="h-8 w-8" />,
    title: "Record Your Voice",
    description:
      "Speak into the app and our AI captures your voice patterns, tone, pace, and verbal tendencies.",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes your speech patterns, identifying strengths and areas for improvement.",
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Personalized Feedback",
    description:
      "Receive detailed, actionable feedback tailored to your specific goals and communication style.",
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: "Practice & Improve",
    description:
      "Apply the feedback during guided practice sessions with real-time AI coaching and support.",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref as React.RefObject<HTMLDivElement>, {
    once: true,
    margin: "-100px",
  });

  return (
    <section id="how-it-works" className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How VoiceCoach AI Works
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform combines cutting-edge AI technology with proven
              coaching methodologies to deliver a seamless, effective learning
              experience.
            </p>

            <div className="space-y-8" ref={ref}>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Button size="lg">Start Your Voice Journey</Button>
            </div>
          </div>

          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-xl border border-muted"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-background opacity-90"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Interactive Demo</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  See how our AI coach provides real-time feedback and guidance
                  as you practice your communication skills.
                </p>

                <Button className="relative group">
                  <span className="absolute -inset-0.5 opacity-70 bg-gradient-to-r from-primary to-chart-2 blur rounded-lg group-hover:opacity-100 transition duration-200"></span>
                  <span className="relative flex items-center gap-2 px-4 py-2">
                    Try Interactive Demo
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
