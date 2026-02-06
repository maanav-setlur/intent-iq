import { motion } from "framer-motion";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { IntentDistributionChart } from "@/components/dashboard/IntentDistributionChart";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export default function Demo() {
  return (
    <section className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Eye className="h-3 w-3" />
            Interactive Demo
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            See IntentIQ in Action
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            This is a live preview of the dashboard using sample data. In production, this reflects your real visitors.
          </p>
        </div>

        <div className="space-y-6">
          <MetricsCards />
          <div className="grid gap-6 lg:grid-cols-2">
            <IntentDistributionChart />
            <LiveActivityFeed />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
