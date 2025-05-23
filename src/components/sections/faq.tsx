"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "@/lib/motion";

const faqs = [
  {
    question: "How does the AI voice coaching work?",
    answer:
      "Our AI uses advanced natural language processing and speech recognition to analyze your speaking patterns, tone, pace, and content. It identifies areas for improvement and provides personalized feedback based on proven coaching methodologies.",
  },
  {
    question: "Do I need any special equipment?",
    answer:
      "No special equipment is required. You can use the built-in microphone on your computer or smartphone. However, for the best experience and more accurate analysis, we recommend using a decent quality microphone.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We take data privacy seriously. Your voice recordings and personal information are encrypted and stored securely. We never share your data with third parties, and you can delete your recordings at any time.",
  },
  {
    question: "Can I use VoiceCoach AI in different languages?",
    answer:
      "Currently, we support English (US, UK, AU, CA) with native-level accuracy. We're actively working on expanding to more languages, including Spanish, French, German, and Japanese.",
  },
  {
    question: "How long does it take to see improvement?",
    answer:
      "Most users report noticeable improvement within 2-3 weeks of regular practice (3-4 sessions per week). However, this varies depending on your starting point, goals, and practice consistency.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your current billing period. We don't offer refunds for partial subscription periods.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, we have native mobile apps for both iOS and Android devices. You can practice your speaking skills on the go and sync your progress across all your devices.",
  },
  {
    question: "Do you offer coaching for specific scenarios?",
    answer:
      "Yes, our Professional and Enterprise plans include custom scenario training for job interviews, sales pitches, presentations, public speaking, debates, and more. You can also create your own custom scenarios.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about VoiceCoach AI.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
