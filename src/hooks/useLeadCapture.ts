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
      try {
        const res = await fetch(`${API_URL}/api/capture-lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...lead,
            behavioral_context: behavior,
          }),
        });

        if (res.ok) {
          return res.json();
        }
      } catch {
        // Backend unavailable — treat as best-effort for demo purposes
        console.debug("[IntentIQ] Lead capture backend unavailable, continuing gracefully");
      }

      return { status: "ok" };
    },
    [getBehaviorData]
  );

  return { captureLead };
}
