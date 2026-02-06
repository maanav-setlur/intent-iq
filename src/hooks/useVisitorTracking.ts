import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";

const eventSchema = z.object({
  type: z.literal("page_view"),
  page: z.string().max(500).regex(/^\/[a-zA-Z0-9_\/?#&=%.\-]*$/),
  timestamp: z.string().datetime(),
  duration_seconds: z.number().int().min(0).max(86400),
});

type TrackingEvent = z.infer<typeof eventSchema>;

interface ProactiveMessage {
  id: string;
  content: string;
  researched_insights?: string[];
}

interface TrackingResponse {
  success: boolean;
  intent_score: number;
  threshold_triggered: boolean;
  message?: ProactiveMessage;
}

const generateId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

const getVisitorId = (): string => {
  const stored = localStorage.getItem("intentiq_visitor_id");
  if (stored) return stored;
  const id = `vis_${generateId()}`;
  localStorage.setItem("intentiq_visitor_id", id);
  return id;
};

const getSessionId = (): string => {
  const stored = sessionStorage.getItem("intentiq_session_id");
  if (stored) return stored;
  const id = `ses_${generateId()}`;
  sessionStorage.setItem("intentiq_session_id", id);
  return id;
};

const API_URL = import.meta.env.VITE_TRACKING_API_URL || "https://intent-agent-backend.onrender.com";

export function useVisitorTracking() {
  const location = useLocation();
  const pageEnteredAt = useRef(Date.now());
  const eventsQueue = useRef<TrackingEvent[]>([]);
  const flushTimer = useRef<ReturnType<typeof setTimeout>>();
  const [proactiveMessage, setProactiveMessage] = useState<ProactiveMessage | null>(null);
  const [intentScore, setIntentScore] = useState(0);

  const visitorId = useRef(getVisitorId()).current;
  const sessionId = useRef(getSessionId()).current;

  const flush = useCallback(async () => {
    if (eventsQueue.current.length === 0 || !API_URL) return;

    const rawEvents = [...eventsQueue.current];
    eventsQueue.current = [];

    const events = rawEvents.filter((e) => eventSchema.safeParse(e).success);
    if (events.length === 0) return;

    try {
      const res = await fetch(`${API_URL}/api/track-behavior`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id: visitorId,
          company_domain: null,
          session_id: sessionId,
          events,
        }),
      });

      if (res.ok) {
        const data: TrackingResponse = await res.json();
        setIntentScore(data.intent_score);
        if (data.threshold_triggered && data.message) {
          setProactiveMessage(data.message);
        }
      }
    } catch {
      // Silently handle - events are lost but that's acceptable
      console.debug("[IntentIQ] Failed to send tracking data");
    }
  }, [visitorId, sessionId]);

  const scheduleFlush = useCallback(() => {
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, 2000);
  }, [flush]);

  // Track page views
  useEffect(() => {
    pageEnteredAt.current = Date.now();

    const event: TrackingEvent = {
      type: "page_view",
      page: location.pathname,
      timestamp: new Date().toISOString(),
      duration_seconds: 0,
    };
    eventsQueue.current.push(event);
    scheduleFlush();

    return () => {
      // Update duration on the last event for this page
      const durationSec = Math.round((Date.now() - pageEnteredAt.current) / 1000);
      const lastEvent = eventsQueue.current.find(
        (e) => e.page === location.pathname && e.duration_seconds === 0
      );
      if (lastEvent) {
        lastEvent.duration_seconds = durationSec;
      } else {
        eventsQueue.current.push({
          type: "page_view",
          page: location.pathname,
          timestamp: new Date().toISOString(),
          duration_seconds: durationSec,
        });
      }
      flush();
    };
  }, [location.pathname, scheduleFlush, flush]);

  // Flush on unload
  useEffect(() => {
    const handleUnload = () => flush();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [flush]);

  const dismissMessage = useCallback(() => setProactiveMessage(null), []);

  return { proactiveMessage, dismissMessage, intentScore };
}
