"use client";

import {
  Mic,
  MessageSquare,
  LineChart,
  User,
  Layers,
  CheckCircle,
} from "lucide-react";
import { motion } from "@/lib/motion";

const features = [
  {
    icon: <Mic className="h-10 w-10 text-chart-1" />,
    title: "Voice Recognition",
    description:
      "Advanced speech recognition captures every nuance and tone in your voice for precise analysis.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-chart-2" />,
    title: "Real-time Feedback",
    description:
      "Get instant, actionable feedback to improve your speaking skills during your practice sessions.",
  },
  {
    icon: <LineChart className="h-10 w-10 text-chart-3" />,
    title: "Progress Tracking",
    description:
      "Monitor your improvement over time with detailed analytics and progress reports.",
  },
  {
    icon: <User className="h-10 w-10 text-chart-4" />,
    title: "Personalized Coaching",
    description:
      "AI adapts to your unique voice, goals, and learning style for tailored coaching experience.",
  },
  {
    icon: <Layers className="h-10 w-10 text-chart-5" />,
    title: "Multi-skill Development",
    description:
      "Improve public speaking, presentations, interviews, sales pitches, and more with specialized modules.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-chart-1" />,
    title: "Practice Scenarios",
    description:
      "Train with realistic scenarios and situations for practical skill-building and confidence.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Your Communication Skills
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI voice coach provides comprehensive tools to analyze, improve,
            and perfect your verbal communication skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-background border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
