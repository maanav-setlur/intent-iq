import { motion } from "framer-motion";

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

export function HowItWorksSection() {
  return (
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
  );
}
