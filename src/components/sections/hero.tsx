"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic, Play, ChevronRight } from "lucide-react";
import { motion } from "@/lib/motion";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/10 to-transparent opacity-50 dark:from-primary/20" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New: Custom voice detection launched
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              AI Voice Coach for{" "}
              <span className="text-primary">Personal Growth</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Get personalized coaching through our advanced AI that analyzes
              your voice, provides real-time feedback, and helps you develop new
              skills faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto group">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  See it in action
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required. 7-day free trial.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-md">
              <div
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-background to-muted border shadow-xl transition-all duration-300 ${
                  isHovered ? "scale-[1.02] shadow-2xl" : "scale-100"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted p-6 flex items-center justify-center">
                  {/* Animated voice waveform */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-end gap-[3px] h-32 w-64">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary/60 rounded-full"
                          style={{
                            height: `${Math.sin(i * 0.2) * 50 + 20}%`,
                            animation: `pulse 1.5s ease-in-out infinite ${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 text-center">
                    <Mic className="w-16 h-16 mb-4 mx-auto text-primary animate-pulse" />
                    <h3 className="text-xl font-medium mb-2">
                      AI Listening...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      "Tell me about your goals for public speaking..."
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Voice Analysis</h3>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Confidence: 78%</span>
                      <span>Clarity: 82%</span>
                    </div>
                  </div>

                  <p className="text-sm border-l-2 border-primary pl-3 py-1">
                    Your pace is excellent, but I notice slight hesitation. Try
                    focusing on deeper breaths between phrases to increase
                    confidence.
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-40 h-40 bg-chart-2/30 rounded-full blur-2xl" />
              <div className="absolute -z-10 -top-6 -left-6 w-40 h-40 bg-chart-5/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
