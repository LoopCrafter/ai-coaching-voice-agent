"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-5/20 dark:from-primary/30 dark:to-chart-5/30"></div>

          <div className="relative py-16 px-6 sm:py-24 sm:px-12 md:py-32 md:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
              Start Your Voice Transformation Today
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their
              communication skills with VoiceCoach AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="relative group">
                  <span className="absolute -inset-0.5 opacity-70 bg-gradient-to-r from-primary to-chart-2 blur rounded-lg group-hover:opacity-100 transition duration-200"></span>
                  <span className="relative px-6">Start 7-Day Free Trial</span>
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg">
                  See Live Demo
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
