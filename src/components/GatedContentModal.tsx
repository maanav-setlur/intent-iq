import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Play, CheckCircle2, Loader2 } from "lucide-react";

export type GatedContentType = "whitepaper" | "demo";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().min(1, "Company is required").max(200),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface GatedContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: GatedContentType;
  onSubmit: (data: { name: string; email: string; company: string; content_type: GatedContentType }) => Promise<void>;
}

const CONTENT_CONFIG = {
  whitepaper: {
    icon: FileText,
    title: "Download Our White Paper",
    description:
      "Get the full guide on AI-powered visitor intent detection — strategies, benchmarks, and implementation playbooks.",
    cta: "Download White Paper",
    successTitle: "Your white paper is on its way!",
    successDescription:
      "You should receive it in your inbox shortly. Check your spam folder if you don't see it within a few minutes.",
  },
  demo: {
    icon: Play,
    title: "Try the Interactive Demo",
    description:
      "See IntentIQ in action with a live walkthrough of real-time visitor tracking and intent scoring.",
    cta: "Launch Demo",
    successTitle: "You're all set!",
    successDescription:
      "Redirecting you to the interactive demo now…",
  },
} as const;

export function GatedContentModal({
  open,
  onOpenChange,
  contentType,
  onSubmit,
}: GatedContentModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const config = CONTENT_CONFIG[contentType];
  const Icon = config.icon;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadSchema) });

  const onFormSubmit = async (data: LeadFormValues) => {
    setStatus("submitting");
    try {
      await onSubmit({
        name: data.name!,
        email: data.email!,
        company: data.company!,
        content_type: contentType,
      });
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      // Reset state when closing
      setTimeout(() => {
        setStatus("idle");
        reset();
      }, 200);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle2 className="h-7 w-7 text-accent" />
            </div>
            <DialogHeader className="items-center">
              <DialogTitle>{config.successTitle}</DialogTitle>
              <DialogDescription>{config.successDescription}</DialogDescription>
            </DialogHeader>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
            <p className="mt-3 text-xs text-muted-foreground/70 italic">
              This is a demo project — no actual content will be delivered.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="mt-2 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="gated-name">Name</Label>
                <Input
                  id="gated-name"
                  placeholder="Jane Smith"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gated-email">Work Email</Label>
                <Input
                  id="gated-email"
                  type="email"
                  placeholder="jane@acme.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gated-company">Company</Label>
                <Input
                  id="gated-company"
                  placeholder="Acme Corp"
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  config.cta
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
