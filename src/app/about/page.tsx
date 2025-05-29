"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, Target, Award, Globe } from "lucide-react";

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/team/sarah.jpg",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/team/michael.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of AI",
    image: "/team/emily.jpg",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    image: "/team/david.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          >
            About VoiceCoach AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Transforming communication through AI-powered voice coaching
          </motion.p>
        </div>

        {/* Stats Section
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div> */}

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              At VoiceCoach AI, we&apos;re on a mission to revolutionize how
              people communicate. We believe that effective communication is the
              key to success in both personal and professional life.
            </p>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform provides personalized coaching to help you
              develop your voice and communication skills, making you more
              confident and effective in every conversation.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="w-32 h-32 text-primary/50" />
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-6 bg-card dark:bg-zinc-800/50 border border-border/50">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-16 h-16 text-primary/50" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
