import { Shield } from "lucide-react";

export function TestimonialSection() {
  return (
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
  );
}
