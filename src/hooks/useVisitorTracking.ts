import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import type { VisitorInfo } from "@/components/VisitorIdentificationForm";

export type IntentLevel = "low" | "medium" | "high";

interface ProactiveMessage {
  id: string;
  content: string;
  intent_level: IntentLevel;
  researched_insights?: string[];
  cta?: { label: string; url: string };
}

interface TrackingResponse {
  message?: string;
  intent_level?: IntentLevel;
  learning_stats?: Record<string, unknown>;
  cta?: { label: string; url: string };
}

const API_URL =
  import.meta.env.VITE_TRACKING_API_URL ||
  "https://intent-agent-backend.onrender.com";

const VISITOR_KEY = "intentiq_visitor_info";

function getStoredVisitor(): VisitorInfo | null {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VisitorInfo;
  } catch {
    return null;
  }
}

function storeVisitor(info: VisitorInfo) {
  localStorage.setItem(VISITOR_KEY, JSON.stringify(info));
}

/** Convert raw learning_stats into human-readable insight strings */
function formatLearningStats(stats: Record<string, unknown>): string[] {
  const insights: string[] = [];
  for (const [key, value] of Object.entries(stats)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      const sent = obj.sent as number | undefined;
      const rate = obj.response_rate as number | undefined;
      if (sent && sent > 0) {
        insights.push(`${sent} ${key} messages sent${rate ? ` (${Math.round(Number(rate) * 100)}% response rate)` : ""}`);
      }
    } else if (typeof value === "string") {
      insights.push(`${key}: ${value}`);
    }
  }
  return insights.length > 0 ? insights : [];
}

/** Client-side intent scoring based on behavioral signals */
function inferIntentLevel(
  pagesVisited: string[],
  isReturn: boolean,
  scrollDepth: number,
  timeOnPage: number,
  referrer: string
): IntentLevel {
  let score = 0;

  if (pagesVisited.includes("/pricing")) score += 3;
  if (isReturn) score += 2;

  const pageCount = pagesVisited.length;
  if (pageCount >= 3) score += 2;
  else if (pageCount >= 2) score += 1;

  if (scrollDepth > 85) score += 2;
  else if (scrollDepth > 60) score += 1;

  if (timeOnPage > 60) score += 2;
  else if (timeOnPage > 30) score += 1;

  if (/google|linkedin|bing/i.test(referrer)) score += 2;

  if (score >= 5) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export function useVisitorTracking() {
  const location = useLocation();
  const pageEnteredAt = useRef(Date.now());
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(getStoredVisitor);
  const [showForm, setShowForm] = useState(false);
  const [proactiveMessage, setProactiveMessage] = useState<ProactiveMessage | null>(null);
  const [intentLevel, setIntentLevel] = useState<IntentLevel>("low");
  const formPrompted = useRef(false);
  const { getBehaviorData } = useBehaviorTracking();

  const sendPageData = useCallback(
    async (info: VisitorInfo | null, page: string, duration: number) => {
      if (!API_URL) return;
      const behavior = getBehaviorData();
      try {
        const res = await fetch(`${API_URL}/api/process-visitor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: info?.name || "",
            email: info?.email || "",
            company: info?.company || "",
            page,
            time_on_page: duration,
            ...behavior,
          }),
        });

        if (res.ok) {
          const data: TrackingResponse = await res.json();
          const level =
            data.intent_level ||
            inferIntentLevel(behavior.pages_visited, behavior.is_return_visitor, behavior.scroll_depth, duration, behavior.referrer);
          setIntentLevel(level);

          if (data.message) {
            setProactiveMessage({
              id: `msg_${Date.now()}`,
              content: data.message,
              intent_level: level,
              researched_insights: undefined,
              cta: data.cta,
            });
          }

          // Form disabled — relying on proactive message widget only
        }
      } catch {
        // Fallback: infer intent client-side even if API fails
        const behavior = getBehaviorData();
        const elapsed = Math.round((Date.now() - pageEnteredAt.current) / 1000);
        const level = inferIntentLevel(behavior.pages_visited, behavior.is_return_visitor, behavior.scroll_depth, elapsed, behavior.referrer);
        setIntentLevel(level);
        console.debug("[IntentIQ] Failed to send tracking data");
      }
    },
    [getBehaviorData]
  );

  // Send on page enter (anonymous or identified)
  useEffect(() => {
    pageEnteredAt.current = Date.now();
    sendPageData(visitorInfo, location.pathname, 0);

    return () => {
      const durationSec = Math.round(
        (Date.now() - pageEnteredAt.current) / 1000
      );
      const behavior = getBehaviorData();
      const payload = JSON.stringify({
        name: visitorInfo?.name || "",
        email: visitorInfo?.email || "",
        company: visitorInfo?.company || "",
        page: location.pathname,
        time_on_page: durationSec,
        ...behavior,
      });
      navigator.sendBeacon?.(
        `${API_URL}/api/process-visitor`,
        new Blob([payload], { type: "application/json" })
      );
    };
  }, [location.pathname, visitorInfo, sendPageData, getBehaviorData]);

  // Send on unload
  useEffect(() => {
    const handleUnload = () => {
      const durationSec = Math.round(
        (Date.now() - pageEnteredAt.current) / 1000
      );
      const behavior = getBehaviorData();
      const payload = JSON.stringify({
        name: visitorInfo?.name || "",
        email: visitorInfo?.email || "",
        company: visitorInfo?.company || "",
        page: location.pathname,
        time_on_page: durationSec,
        ...behavior,
      });
      navigator.sendBeacon?.(
        `${API_URL}/api/process-visitor`,
        new Blob([payload], { type: "application/json" })
      );
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [visitorInfo, location.pathname, getBehaviorData]);

  const identifyVisitor = useCallback(
    (info: VisitorInfo) => {
      storeVisitor(info);
      setVisitorInfo(info);
      setShowForm(false);
      sendPageData(info, location.pathname, 0);
    },
    [location.pathname, sendPageData]
  );

  const dismissForm = useCallback(() => setShowForm(false), []);
  const dismissMessage = useCallback(() => setProactiveMessage(null), []);

  return {
    proactiveMessage,
    dismissMessage,
    showForm,
    identifyVisitor,
    dismissForm,
    visitorInfo,
    intentLevel,
  };
}
