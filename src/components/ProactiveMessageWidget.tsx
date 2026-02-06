import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

interface ProactiveMessage {
  id: string;
  content: string;
  researched_insights?: string[];
}

interface Props {
  message: ProactiveMessage | null;
  onDismiss: () => void;
}

export function ProactiveMessageWidget({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 10000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

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

            {message.researched_insights && message.researched_insights.length > 0 && (
              <ul className="space-y-1.5">
                {message.researched_insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {insight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
