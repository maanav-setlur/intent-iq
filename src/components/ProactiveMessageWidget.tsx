import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  high: null,
};

const INTENT_BADGE: Record<IntentLevel, { label: string; className: string }> = {
  low: { label: "Low Intent", className: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium Intent", className: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400" },
  high: { label: "High Intent", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400" },
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
    const url = message.cta?.url || "/book-demo";
    // External URLs open in new tab; internal paths use router
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener");
    } else {
      navigate(url);
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
        >
          {message.intent_level === "low" && (
            <LowIntentCard message={message} onDismiss={onDismiss} />
          )}
          {message.intent_level === "medium" && (
            <MediumIntentCard message={message} onDismiss={onDismiss} onCta={handleCta} />
          )}
          {message.intent_level === "high" && (
            <HighIntentCard message={message} onDismiss={onDismiss} onCta={handleCta} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IntentBadge({ level }: { level: IntentLevel }) {
  const config = INTENT_BADGE[level];
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${config.className}`}>
      {config.label}
    </Badge>
  );
}

/* ─── Low Intent: subtle but noticeable nudge ─── */
function LowIntentCard({ message, onDismiss }: { message: ProactiveMessage; onDismiss: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card px-5 py-4 shadow-xl shadow-primary/5 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">IntentIQ</span>
              <IntentBadge level="low" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{message.content}</p>
          </div>
        </div>
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
  message, onDismiss, onCta,
}: { message: ProactiveMessage; onDismiss: () => void; onCta: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-2xl shadow-primary/15">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60" />
      <motion.div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-foreground">IntentIQ</span>
              <div><IntentBadge level="medium" /></div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-foreground">{message.content}</p>

        <Button variant="secondary" size="sm" className="w-full gap-1.5" onClick={onCta}>
          {message.cta?.label || "Try Free for 14 Days"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ─── High Intent: prominent card with animated glow ─── */
function HighIntentCard({
  message, onDismiss, onCta,
}: { message: ProactiveMessage; onDismiss: () => void; onCta: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-card p-5 shadow-2xl shadow-primary/25">
      {/* Animated top gradient bar */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))", backgroundSize: "200% 100%" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Ambient glow */}
      <motion.div
        className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-accent/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 ring-2 ring-primary/20"
              animate={{ boxShadow: ["0 0 0px hsl(var(--primary)/0.2)", "0 0 12px hsl(var(--primary)/0.4)", "0 0 0px hsl(var(--primary)/0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4 text-primary" />
            </motion.div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-foreground">IntentIQ</span>
              <div><IntentBadge level="high" /></div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm font-medium leading-relaxed text-foreground">
          {message.content}
        </p>

        <Button size="sm" className="w-full gap-1.5 shadow-md shadow-primary/20" onClick={onCta}>
          {message.cta?.label || "Start Free Trial"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
