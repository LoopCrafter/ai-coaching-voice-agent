"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "@/lib/motion";

const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for individuals just starting out",
    monthly: 9.99,
    yearly: 99.99,
    features: [
      "Voice analysis & feedback",
      "Basic progress tracking",
      "5 practice sessions per month",
      "Email support",
      false, // Advanced analytics
      false, // Custom scenarios
      false, // Priority support
    ],
    popular: false,
    buttonVariant: "outline" as const,
  },
  {
    name: "Professional",
    description: "Ideal for professionals wanting to excel",
    monthly: 19.99,
    yearly: 199.99,
    features: [
      "Voice analysis & feedback",
      "Detailed progress tracking",
      "Unlimited practice sessions",
      "Email & chat support",
      "Advanced analytics",
      "10 custom scenarios",
      false, // Priority support
    ],
    popular: true,
    buttonVariant: "default" as const,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    monthly: 49.99,
    yearly: 499.99,
    features: [
      "Voice analysis & feedback",
      "Detailed progress tracking",
      "Unlimited practice sessions",
      "24/7 support",
      "Advanced analytics & reports",
      "Unlimited custom scenarios",
      "Priority support & training",
    ],
    popular: false,
    buttonVariant: "outline" as const,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your needs. All plans include a 7-day
            free trial.
          </p>

          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Label htmlFor="billing-toggle">Monthly</Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label
                htmlFor="billing-toggle"
                className="flex items-center gap-2"
              >
                Yearly
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative rounded-xl border bg-background shadow-sm overflow-hidden ${
                plan.popular ? "border-primary shadow-lg md:scale-105" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center text-xs font-medium py-1">
                  MOST POPULAR
                </div>
              )}

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <p className="text-4xl font-bold">
                    ${isYearly ? plan.yearly : plan.monthly}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {isYearly ? "per year" : "per month"}
                  </p>
                </div>

                <Link href="/signup">
                  <Button className="w-full" variant={plan.buttonVariant}>
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              <div className="border-t">
                <div className="p-6 md:p-8 space-y-4">
                  <p className="font-medium">What&#39;s included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature ? (
                          <>
                            <Check className="h-5 w-5 text-primary shrink-0 mr-3" />
                            <span>{feature}</span>
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
                            <span className="text-muted-foreground">
                              {
                                pricingPlans.find(
                                  (p) => p.features[featureIndex] !== false
                                )?.features[featureIndex]
                              }
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom plan for your organization?{" "}
            <Link
              href="/contact"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
