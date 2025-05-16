"use client";

import { currentUser } from "@clerk/nextjs/server";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import AuthProvider from "./handler/AuthProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>s{children}</AuthProvider>
    </ConvexProvider>
  );
}
