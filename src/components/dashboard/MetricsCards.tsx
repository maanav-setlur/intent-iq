import { Card, CardContent } from "@/components/ui/card";
import { Target, Send, Reply, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
  {
    icon: Target,
    label: "Avg Intent Score",
    value: "78",
    suffix: "/100",
    trend: "+12%",
    up: true,
  },
  {
    icon: Send,
    label: "Messages Sent",
    value: "24",
    trend: "+8%",
    up: true,
  },
  {
    icon: Reply,
    label: "Reply Rate",
    value: "62.5",
    suffix: "%",
    trend: "+5.2%",
    up: true,
  },
  {
    icon: DollarSign,
    label: "Pipeline Generated",
    value: "$180K",
    trend: "-3%",
    up: false,
  },
];

export function MetricsCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m) => (
        <Card key={m.label} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <m.icon className="h-4 w-4" />
              <span className="text-xs">{m.label}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">
                {m.value}
              </span>
              {m.suffix && (
                <span className="text-sm text-muted-foreground">{m.suffix}</span>
              )}
            </div>
            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${m.up ? "text-accent" : "text-destructive"}`}>
              {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {m.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
