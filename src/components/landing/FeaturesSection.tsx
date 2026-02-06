import { motion } from "framer-motion";
import { Activity, Brain, MessageSquare, BarChart3 } from "lucide-react";

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

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export function FeaturesSection() {
  return (
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
  );
}
