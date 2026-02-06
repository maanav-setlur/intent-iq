import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Activity, Brain, MessageSquare, Zap, ArrowRight, BarChart3, Shield, FileText, Play } from "lucide-react";
import { GatedContentModal, type GatedContentType } from "@/components/GatedContentModal";
import { useLeadCapture } from "@/hooks/useLeadCapture";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function Index() {
  const [gatedModal, setGatedModal] = useState<{ open: boolean; type: GatedContentType }>({
    open: false,
    type: "whitepaper",
  });
  const { captureLead } = useLeadCapture();

  const openGated = (type: GatedContentType) =>
    setGatedModal({ open: true, type });

  const handleLeadSubmit = async (data: Parameters<typeof captureLead>[0]) => {
    await captureLead(data);
  };

  return (
    <>
      <HeroSection onOpenGated={openGated} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CtaSection onOpenGated={openGated} />

      <GatedContentModal
        open={gatedModal.open}
        onOpenChange={(open) => setGatedModal((prev) => ({ ...prev, open }))}
        contentType={gatedModal.type}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}
