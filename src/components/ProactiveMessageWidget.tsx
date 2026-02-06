import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IntentLevel } from "@/hooks/useVisitorTracking";

interface ProactiveMessage {
  id: string;
  content: string;
  intent_level: IntentLevel;
  researched_insights?: string[];
  cta?: { label: string; url: string };
}

interface Props {
  message: ProactiveMessage | null;
  onDismiss: () => void;
}

const DISMISS_TIMERS: Record<IntentLevel, number | null> = {
  low: 8000,
  medium: 15000,
  high: null, // stays until dismissed
};

export function ProactiveMessageWidget({ message, onDismiss }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!message) return;
    const ms = DISMISS_TIMERS[message.intent_level];
    if (!ms) return;
    const timer = setTimeout(onDismiss, ms);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const handleCta = () => {
    if (!message) return;
    const url = message.cta?.url || "/pricing";
    navigate(url);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)]"
        >
          {message.intent_level === "low" && (
            <LowIntentCard message={message} onDismiss={onDismiss} />
          )}
          {message.intent_level === "medium" && (
            <MediumIntentCard
              message={message}
              onDismiss={onDismiss}
              onCta={handleCta}
            />
          )}
          {message.intent_level === "high" && (
            <HighIntentCard
              message={message}
              onDismiss={onDismiss}
              onCta={handleCta}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Low Intent: subtle nudge ─── */
function LowIntentCard({
  message,
  onDismiss,
}: {
  message: ProactiveMessage;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-xl border bg-card/80 px-4 py-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{message.content}</p>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Medium Intent: card with soft CTA ─── */
function MediumIntentCard({
  message,
  onDismiss,
  onCta,
}: {
  message: ProactiveMessage;
  onDismiss: () => void;
  onCta: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-2xl shadow-primary/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">IntentIQ</span>
        </div>
        <button
          onClick={onDismiss}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-foreground">{message.content}</p>

      <Button
        variant="secondary"
        size="sm"
        className="w-full gap-1.5"
        onClick={onCta}
      >
        {message.cta?.label || "Try Free for 14 Days"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/* ─── High Intent: prominent card with glow + insights ─── */
function HighIntentCard({
  message,
  onDismiss,
  onCta,
}: {
  message: ProactiveMessage;
  onDismiss: () => void;
  onCta: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 shadow-2xl shadow-primary/20 ring-1 ring-primary/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground">IntentIQ</span>
        </div>
        <button
          onClick={onDismiss}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-3 text-sm font-medium leading-relaxed text-foreground">
        {message.content}
      </p>

      {message.researched_insights && message.researched_insights.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {message.researched_insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {insight}
            </li>
          ))}
        </ul>
      )}

      <Button size="sm" className="w-full gap-1.5" onClick={onCta}>
        {message.cta?.label || "Start Free Trial"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
