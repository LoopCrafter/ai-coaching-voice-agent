import { FeatureAssistant } from "@/components/pages";
import Feedback from "@/components/pages/dashboard/feedback";
import History from "@/components/pages/dashboard/history";

export default function DashboardPage() {
  return (
    <div className="p-10 ">
      <FeatureAssistant />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
        <History />
        <Feedback />
      </div>
    </div>
  );
}
