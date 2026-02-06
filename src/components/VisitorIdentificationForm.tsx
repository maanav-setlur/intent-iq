import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import type { IntentLevel } from "@/hooks/useVisitorTracking";

const visitorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().min(1, "Company is required").max(100),
});

export type VisitorInfo = z.infer<typeof visitorSchema>;

const COPY: Record<IntentLevel, { heading: string; subheading: string; button: string }> = {
  low: {
    heading: "Stay in the Loop",
    subheading: "Get updates and tips",
    button: "Subscribe",
  },
  medium: {
    heading: "Unlock Personalized Insights",
    subheading: "Get personalized insights",
    button: "Get Personalized Insights",
  },
  high: {
    heading: "Get Your Personalized Demo",
    subheading: "See how IntentIQ works for your team",
    button: "Book Demo",
  },
};

interface Props {
  open: boolean;
  onSubmit: (info: VisitorInfo) => void;
  onDismiss: () => void;
  intentLevel?: IntentLevel;
}

export function VisitorIdentificationForm({ open, onSubmit, onDismiss, intentLevel = "medium" }: Props) {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof VisitorInfo, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const copy = COPY[intentLevel];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = visitorSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof VisitorInfo;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    onSubmit(result.data);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
        >
          <div className="rounded-2xl border bg-card p-5 shadow-2xl shadow-primary/10">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{copy.heading}</span>
                  <p className="text-xs text-muted-foreground">{copy.subheading}</p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="visitor-name" className="text-xs">Name</Label>
                <Input
                  id="visitor-name"
                  placeholder="Sarah Chen"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 h-9 text-sm"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="visitor-email" className="text-xs">Email</Label>
                <Input
                  id="visitor-email"
                  type="email"
                  placeholder="sarah@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 h-9 text-sm"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="visitor-company" className="text-xs">Company</Label>
                <Input
                  id="visitor-company"
                  placeholder="Stripe"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="mt-1 h-9 text-sm"
                />
                {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
              </div>
              <Button type="submit" className="w-full" size="sm" disabled={submitting}>
                {submitting ? "Connecting…" : copy.button}
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
