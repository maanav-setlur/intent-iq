import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, ArrowRight, FileText, Play } from "lucide-react";
import type { GatedContentType } from "@/components/GatedContentModal";

interface HeroSectionProps {
  onOpenGated: (type: GatedContentType) => void;
}

export function HeroSection({ onOpenGated }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="container relative py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Now with AI-powered intent detection
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Know your visitors{" "}
            <span className="text-gradient">before they knock</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            IntentIQ tracks visitor behavior in real-time, scores buying intent with AI,
            and proactively engages high-value leads — so you never miss a deal.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2" asChild>
              <Link to="/pricing">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/docs">View Documentation</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => onOpenGated("whitepaper")}
            >
              <FileText className="h-4 w-4" />
              Download White Paper
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => onOpenGated("demo")}
            >
              <Play className="h-4 w-4" />
              Try Demo
            </Button>
          </div>
        </motion.div>

        {/* Floating metrics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4"
        >
          {[
            { label: "Visitors tracked", value: "2.4M+" },
            { label: "Avg. intent accuracy", value: "94%" },
            { label: "Revenue influenced", value: "$18M" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-background/60 p-4 text-center backdrop-blur">
              <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
