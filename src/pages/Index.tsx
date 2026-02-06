import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Activity, Brain, MessageSquare, Zap, ArrowRight, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Visitor Tracking",
    description: "Monitor every page view, click, and scroll in real-time. Understand exactly how visitors engage with your site.",
  },
  {
    icon: Brain,
    title: "AI Intent Scoring",
    description: "Our ML models analyze behavioral patterns to calculate intent scores, identifying your hottest leads instantly.",
  },
  {
    icon: MessageSquare,
    title: "Proactive Messaging",
    description: "Trigger personalized messages at the perfect moment. Engage high-intent visitors before they leave.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Comprehensive dashboards with session replay, funnel analysis, and conversion attribution.",
  },
];

const steps = [
  { num: "01", title: "Install the snippet", desc: "Add one line of JavaScript to your site. Takes under 2 minutes." },
  { num: "02", title: "Track visitor intent", desc: "Our engine analyzes behavior patterns and scores every visitor in real-time." },
  { num: "03", title: "Engage & convert", desc: "Trigger personalized messages when intent peaks. Close deals faster." },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <>
      {/* Hero */}
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

      {/* Features */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to convert visitors into customers
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete visitor intelligence platform — from tracking to engagement.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fade}
              className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="container py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps to start converting more visitors.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.num}
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center md:p-12">
          <div className="mb-4 flex justify-center gap-1">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <p className="text-lg font-medium italic text-foreground md:text-xl">
            "IntentIQ helped us identify 3x more high-intent visitors and increased our demo bookings by 47% in the first month."
          </p>
          <div className="mt-6">
            <p className="font-semibold">Sarah Chen</p>
            <p className="text-sm text-muted-foreground">VP of Growth, Acme Corp</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-hero-gradient">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="container relative py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to stop losing high-intent visitors?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join hundreds of B2B teams using IntentIQ to convert anonymous traffic into qualified pipeline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2" asChild>
              <Link to="/pricing">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/docs">Read the Docs</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
