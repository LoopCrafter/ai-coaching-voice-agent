import { Header } from "@/components/pages";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div className="container mx-auto lg:px-48 mt-20 ">{children}</div>
    </div>
  );
}
