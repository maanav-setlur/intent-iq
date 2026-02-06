import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { IntentDistributionChart } from "@/components/dashboard/IntentDistributionChart";
import { LearningInsightsPanel } from "@/components/dashboard/LearningInsightsPanel";
import { ResearchExamples } from "@/components/dashboard/ResearchExamples";

export default function Dashboard() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="container py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            IntentIQ Agent Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time Activity
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column – 60% */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <LiveActivityFeed />
            <ResearchExamples />
          </div>

          {/* Right column – 40% */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <MetricsCards />
            <IntentDistributionChart />
            <LearningInsightsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
