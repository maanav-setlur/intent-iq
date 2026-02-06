import { useCallback } from "react";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import type { GatedContentType } from "@/components/GatedContentModal";

const API_URL =
  import.meta.env.VITE_TRACKING_API_URL ||
  "https://intent-agent-backend.onrender.com";

interface LeadPayload {
  name: string;
  email: string;
  company: string;
  content_type: GatedContentType;
}

export function useLeadCapture() {
  const { getBehaviorData } = useBehaviorTracking();

  const captureLead = useCallback(
    async (lead: LeadPayload) => {
      const behavior = getBehaviorData();
      const res = await fetch(`${API_URL}/api/capture-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          behavioral_context: behavior,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to capture lead");
      }

      return res.json();
    },
    [getBehaviorData]
  );

  return { captureLead };
}
