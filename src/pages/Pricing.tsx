import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, FileText, Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GatedContentModal, type GatedContentType } from "@/components/GatedContentModal";
import { useLeadCapture } from "@/hooks/useLeadCapture";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "For small teams getting started with visitor intelligence.",
    popular: false,
    features: [
      "Up to 5,000 tracked visitors/mo",
      "Basic intent scoring",
      "3 proactive message templates",
      "Email support",
      "7-day data retention",
    ],
  },
  {
    name: "Professional",
    price: "$149",
    period: "/mo",
    description: "For growing teams that need advanced engagement tools.",
    popular: true,
    features: [
      "Up to 50,000 tracked visitors/mo",
      "AI-powered intent scoring",
      "Unlimited message templates",
      "Priority support",
      "90-day data retention",
      "CRM integrations",
      "Custom webhooks",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with advanced security and scale needs.",
    popular: false,
    features: [
      "Unlimited tracked visitors",
      "Advanced ML models",
      "Dedicated account manager",
      "99.99% SLA",
      "Unlimited data retention",
      "SSO & SCIM",
      "Custom integrations",
      "On-premise deployment option",
    ],
  },
];

export default function Pricing() {
  const [gatedModal, setGatedModal] = useState<{ open: boolean; type: GatedContentType }>({
    open: false,
    type: "whitepaper",
  });
  const { captureLead } = useLeadCapture();

  const openGated = (type: GatedContentType) =>
    setGatedModal({ open: true, type });

  return (
    <section className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Scale as you grow. No hidden fees.
        </p>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-8",
              plan.popular && "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                "mt-8 w-full",
                plan.popular
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : ""
              )}
              variant={plan.popular ? "default" : "outline"}
              size="lg"
            >
              {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Gated content CTAs */}
      <div className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-muted-foreground">Not ready to commit?</span>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => openGated("whitepaper")}
        >
          <FileText className="h-4 w-4" />
          Download White Paper
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => openGated("demo")}
        >
          <Play className="h-4 w-4" />
          Try Demo
        </Button>
      </div>

      <GatedContentModal
        open={gatedModal.open}
        onOpenChange={(open) => setGatedModal((prev) => ({ ...prev, open }))}
        contentType={gatedModal.type}
        onSubmit={async (data) => { await captureLead(data); }}
      />
    </section>
  );
}
