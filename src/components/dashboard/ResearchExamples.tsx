import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle2 } from "lucide-react";
import { researchCards, formatTimeAgo } from "./mockData";

export function ResearchExamples() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Recent Research</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {researchCards.map((r) => (
          <Card key={r.company} className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{r.company}</CardTitle>
              <span className="text-[11px] text-muted-foreground">
                {formatTimeAgo(r.timestampOffset)}
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-1">
                {r.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                    {insight}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {r.sources.map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
