import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, CheckCircle2, Activity } from "lucide-react";
import { activities, formatTimeAgo, type Activity as ActivityType } from "./mockData";
import { motion, AnimatePresence } from "framer-motion";

const eventIcons: Record<ActivityType["eventType"], React.ReactNode> = {
  researching: <Search className="h-4 w-4 text-primary" />,
  message_sent: <MessageSquare className="h-4 w-4 text-amber-400" />,
  reply_received: <CheckCircle2 className="h-4 w-4 text-accent" />,
};

const eventLabels: Record<ActivityType["eventType"], string> = {
  researching: "Researching",
  message_sent: "Message Sent",
  reply_received: "Reply Received",
};

function intentColor(score: number) {
  if (score >= 70) return "text-accent";
  if (score >= 40) return "text-amber-400";
  return "text-destructive";
}

function intentBg(score: number) {
  if (score >= 70) return "bg-accent/15 text-accent border-accent/30";
  if (score >= 40) return "bg-amber-400/15 text-amber-400 border-amber-400/30";
  return "bg-destructive/15 text-destructive border-destructive/30";
}

export function LiveActivityFeed() {
  const [feed, setFeed] = useState(activities.slice(0, 4));

  // Simulate new activities trickling in
  useEffect(() => {
    if (feed.length >= activities.length) return;
    const timer = setTimeout(() => {
      setFeed((prev) => [...prev, activities[prev.length]]);
    }, 4000);
    return () => clearTimeout(timer);
  }, [feed.length]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Live Activity Feed</CardTitle>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Live
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px] px-6 pb-4">
          <AnimatePresence initial={false}>
            {feed.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="border-b border-border py-3 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                    {eventIcons[a.eventType]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(a.timestampOffset)}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {eventLabels[a.eventType]}
                      </Badge>
                      <span className="font-medium text-sm">{a.company}</span>
                      <span className={`ml-auto text-sm font-bold tabular-nums ${intentColor(a.intentScore)}`}>
                        {a.intentScore}
                      </span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${intentBg(a.intentScore)}`}>
                        Intent
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{a.action}</p>
                    {a.insights && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {a.insights}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
