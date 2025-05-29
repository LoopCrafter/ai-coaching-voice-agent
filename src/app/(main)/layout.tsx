import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="container mx-auto lg:px-48 mt-20 ">{children}</div>
    </div>
  );
}
