import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Play } from "lucide-react";
import type { GatedContentType } from "@/components/GatedContentModal";

interface CtaSectionProps {
  onOpenGated: (type: GatedContentType) => void;
}

export function CtaSection({ onOpenGated }: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden border-t bg-hero-gradient">
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
      </div>
    </section>
  );
}
