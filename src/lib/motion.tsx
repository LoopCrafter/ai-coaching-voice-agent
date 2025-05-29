"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
// Simple re-export of motion components
// This helps keep our code cleaner and avoids installing the actual framer-motion
// We can add the real library later if we want more complex animations

import { useEffect, useState } from "react";

export const motion = {
  div: ({ whileInView, transition, animate, initial, exit, ...props }: any) => (
    <div {...props}>{props.children}</div>
  ),
  section: ({
    whileInView,
    transition,
    animate,
    initial,
    exit,
    ...props
  }: any) => <section {...props}>{props.children}</section>,
  button: ({
    whileInView,
    transition,
    animate,
    initial,
    exit,
    ...props
  }: any) => <button {...props}>{props.children}</button>,
  span: ({
    whileInView,
    transition,
    animate,
    initial,
    exit,
    ...props
  }: any) => <span {...props}>{props.children}</span>,
};

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
}

export const useInView = (
  ref: React.RefObject<HTMLElement>,
  options: UseInViewOptions = {}
) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && options.once) {
          observer.unobserve(ref.current!);
        }
      },
      {
        rootMargin: options.margin || "0px",
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options.margin, options.once]);

  return isInView;
};
