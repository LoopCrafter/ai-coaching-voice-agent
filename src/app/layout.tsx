import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "sonner";
import { Footer, Navbar } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coaching With AI",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            <Navbar />
            <main className="min-h-[80vh]">{children}</main>
            <Footer />
          </ConvexClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
