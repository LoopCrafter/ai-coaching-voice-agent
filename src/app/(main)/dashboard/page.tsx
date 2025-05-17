import { FeatureAssistant, Feedback, History } from "@/components/pages";

export default function DashboardPage() {
  return (
    <div className="p-10 container mx-auto lg:px-48 mt-20 ">
      <FeatureAssistant />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
        <History />
        <Feedback />
      </div>
    </div>
  );
}
