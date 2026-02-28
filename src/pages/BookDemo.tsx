import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, CheckCircle2, Clock, Users, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

const benefits = [
  { icon: Zap, title: "Live Product Walkthrough", desc: "See IntentIQ detect intent and generate messages in real-time." },
  { icon: Users, title: "Tailored to Your Use Case", desc: "We'll show how IntentIQ fits your sales workflow." },
  { icon: Clock, title: "30 Minutes", desc: "Quick, focused session — no fluff, no pressure." },
];

export default function BookDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "Please fill in your name and email." });
      return;
    }
    // Demo mode — simulate booking
    setSubmitted(true);
    toast({ title: "Demo Requested!", description: "We'll be in touch within 24 hours." });
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">You're All Set!</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Thanks, {form.name}! We've received your demo request
            {selectedSlot ? ` for ${selectedSlot}` : ""}. A member of our team will reach out within 24 hours to confirm.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            This is a demo project — no real email will be sent.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Book a Demo
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              See how IntentIQ turns anonymous visitors into qualified pipeline — in under 30 minutes.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Benefits sidebar */}
          <motion.div
            className="space-y-6 lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold">What to Expect</h2>
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{b.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}

            {/* Time slots */}
            <div className="pt-4">
              <h2 className="mb-3 text-lg font-semibold">Preferred Time</h2>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot === selectedSlot ? null : slot)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      selectedSlot === slot
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Optional — we'll confirm a time that works.</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            className="space-y-5 rounded-2xl border bg-card p-6 shadow-lg lg:col-span-3"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">What are you hoping to learn?</Label>
              <Textarea
                id="message"
                placeholder="E.g., How does intent scoring work? Can it integrate with our CRM?"
                rows={3}
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Request Demo
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              No credit card required. We'll respond within 24 hours.
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
