"use client";

import Image from "next/image";
import { motion } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    content:
      "VoiceCoach AI has transformed my public speaking skills. I went from nervous and unsure to confident and polished in just a few weeks of practice.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    avatar:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=120",
    rating: 5,
  },
  {
    content:
      "As someone who conducts interviews daily, this app has helped me communicate more effectively and with greater confidence. The personalized feedback is incredibly valuable.",
    author: "Michael Chen",
    role: "HR Manager",
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120",
    rating: 5,
  },
  {
    content:
      "I've tried several coaching apps, but VoiceCoach AI stands out with its accuracy and personalized approach. It feels like having a professional coach with me at all times.",
    author: "Emily Rodriguez",
    role: "Sales Executive",
    avatar:
      "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=120",
    rating: 4,
  },
  {
    content:
      "The progress tracking feature is amazing. Being able to see my improvement over time has been incredibly motivating and helped me stay consistent with practice.",
    author: "David Williams",
    role: "University Professor",
    avatar:
      "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=120",
    rating: 5,
  },
  {
    content:
      "As a non-native English speaker, this app has been invaluable for improving my pronunciation and confidence in professional settings. Highly recommended!",
    author: "Akiko Tanaka",
    role: "Software Engineer",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120",
    rating: 5,
  },
  {
    content:
      "The AI feedback is surprisingly nuanced and helpful. It picks up on subtle issues in my speaking that I would never have noticed myself.",
    author: "James Carter",
    role: "Financial Advisor",
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=120",
    rating: 4,
  },
];

export function TestimonialsSection() {
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted"
          }`}
        />
      ));
  };

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            See how VoiceCoach AI is helping people transform their
            communication skills and reach their goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
