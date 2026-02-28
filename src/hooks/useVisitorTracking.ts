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

/** Clean raw paths like "/pricing" → "Pricing" in message text */
function cleanMessagePaths(text: string): string {
  return text.replace(/\/([a-z][-a-z]*)/gi, (_match, name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  });
}

/** Client-side intent scoring (0-100 scale) per PRD spec:
 *  score = (pricing_page_views * 40) + (time_on_pricing_seconds * 2)
 *        + (docs_page_views * 25) + (scroll_depth_percentage * 0.15)
 *  Low: 0-39 | Medium: 40-69 | High: 70-100
 *  We extend with return-visitor and referrer bonuses. */
function inferIntentLevel(
  pagesVisited: string[],
  isReturn: boolean,
  scrollDepth: number,
  timeOnPage: number,
  referrer: string
): IntentLevel {
  let score = 0;

  // PRD: pricing page views weighted at 40 each
  const pricingViews = pagesVisited.filter((p) => p === "/pricing").length;
  score += pricingViews * 40;

  // PRD: docs page views weighted at 25 each
  const docsViews = pagesVisited.filter((p) => p === "/docs").length;
  score += docsViews * 25;

  // PRD: time on page * 2 (approximate — we only have total time, not per-page)
  score += timeOnPage * 2;

  // PRD: scroll depth * 0.15
  score += scrollDepth * 0.15;

  // Bonus signals (not in PRD formula but referenced in PRD context)
  if (isReturn) score += 10;
  if (/google|linkedin|bing/i.test(referrer)) score += 10;

  // Multi-page engagement bonus
  const pageCount = pagesVisited.length;
  if (pageCount >= 4) score += 10;
  else if (pageCount >= 3) score += 5;

  // Clamp to 0-100
  score = Math.min(100, Math.max(0, Math.round(score)));

  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

/** Quick client-side fallback messages keyed by page path */
function getFallbackMessage(page: string): string {
  if (page === "/pricing") return "Comparing plans? I can help you find the right fit for your team.";
  if (page === "/docs") return "Exploring our docs? Let me know if you need help finding something.";
  if (page === "/dashboard") return "Welcome to the dashboard — here's where the magic happens.";
  if (page === "/demo") return "Ready to see IntentIQ in action? This demo is fully interactive.";
  return "Welcome! Take a look around — I'll have personalized insights for you shortly.";
}

export function useVisitorTracking() {
  const location = useLocation();
  const pageEnteredAt = useRef(Date.now());
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(getStoredVisitor);
  const [showForm, setShowForm] = useState(false);
  const [proactiveMessage, setProactiveMessage] = useState<ProactiveMessage | null>(null);
  const [intentLevel, setIntentLevel] = useState<IntentLevel>("low");
  const formPrompted = useRef(false);
  const pendingRequest = useRef<AbortController | null>(null);
  const displayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getBehaviorData } = useBehaviorTracking();

  /** Queue a message to appear after a natural delay (5-7s) */
  const showMessageWithDelay = useCallback((msg: ProactiveMessage) => {
    if (displayTimer.current) clearTimeout(displayTimer.current);
    const delay = 5000 + Math.random() * 2000; // 5-7 seconds
    displayTimer.current = setTimeout(() => setProactiveMessage(msg), delay);
  }, []);

  const sendPageData = useCallback(
    async (info: VisitorInfo | null, page: string, duration: number) => {
      if (!API_URL) return;

      // Cancel any in-flight request and pending display timer
      pendingRequest.current?.abort();
      if (displayTimer.current) clearTimeout(displayTimer.current);
      setProactiveMessage(null);
      const controller = new AbortController();
      pendingRequest.current = controller;

      // Prepare client-side fallback
      const behavior = getBehaviorData();
      const clientLevel = inferIntentLevel(
        behavior.pages_visited, behavior.is_return_visitor,
        behavior.scroll_depth, duration, behavior.referrer
      );
      setIntentLevel(clientLevel);
      showMessageWithDelay({
        id: `fallback_${Date.now()}`,
        content: getFallbackMessage(page),
        intent_level: clientLevel,
      });

      try {
        const res = await fetch(`${API_URL}/api/process-visitor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
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
            // Upgrade with AI-generated message (respects delay if still pending)
            showMessageWithDelay({
              id: `msg_${Date.now()}`,
              content: cleanMessagePaths(data.message),
              intent_level: level,
              researched_insights: undefined,
              cta: data.cta?.url?.includes("calendly.com/your-link")
                ? { label: data.cta.label, url: "/book-demo" }
                : data.cta,
            });
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Fallback already shown — just log
        console.debug("[IntentIQ] Backend unavailable, using client-side message");
      }
    },
    [getBehaviorData]
  );

  // Send on page enter
  useEffect(() => {
    pageEnteredAt.current = Date.now();
    sendPageData(visitorInfo, location.pathname, 0);

    return () => {
      // Send duration beacon on page leave (no duplicate fetch)
      const durationSec = Math.round(
        (Date.now() - pageEnteredAt.current) / 1000
      );
      if (durationSec < 2) return; // Skip trivial visits
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

  // beforeunload beacon handled by cleanup above — no duplicate listener needed

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
