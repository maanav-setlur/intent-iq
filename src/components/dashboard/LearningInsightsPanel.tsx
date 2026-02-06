import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Sparkles } from "lucide-react";

export function LearningInsightsPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Learning Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Top Performing Message Pattern
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            "ROI-first opener with competitor comparison"
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-accent">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold">68% reply rate</span>
          </div>
          <span className="text-xs text-muted-foreground">
            +23% vs. previous pattern
          </span>
        </div>

        <div className="rounded-md bg-secondary p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Key Insight
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Prospects respond 3× faster when outreach references a recent
            company milestone (funding round, product launch, or executive
            hire) within the first sentence.
          </p>
        </div>

        <Badge className="bg-accent/15 text-accent border-accent/30 text-[11px]">
          ✅ Strategy adjusted automatically
        </Badge>
      </CardContent>
    </Card>
  );
}
