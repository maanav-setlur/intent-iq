import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import type { VisitorInfo } from "@/components/VisitorIdentificationForm";

interface ProactiveMessage {
  id: string;
  content: string;
  researched_insights?: string[];
}

interface TrackingResponse {
  message?: string;
  learning_stats?: Record<string, unknown>;
  visitor?: Record<string, unknown>;
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

export function useVisitorTracking() {
  const location = useLocation();
  const pageEnteredAt = useRef(Date.now());
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(getStoredVisitor);
  const [showForm, setShowForm] = useState(false);
  const [proactiveMessage, setProactiveMessage] = useState<ProactiveMessage | null>(null);
  const formPrompted = useRef(false);

  // Show form after a short delay if visitor not identified
  useEffect(() => {
    if (visitorInfo || formPrompted.current) return;
    const timer = setTimeout(() => {
      formPrompted.current = true;
      setShowForm(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [visitorInfo]);

  const sendPageData = useCallback(
    async (info: VisitorInfo, page: string, duration: number) => {
      if (!API_URL) return;
      try {
        const res = await fetch(`${API_URL}/api/process-visitor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: info.name,
            email: info.email,
            company: info.company,
            page,
            time_on_page: duration,
          }),
        });

        if (res.ok) {
          const data: TrackingResponse = await res.json();
          if (data.message) {
            setProactiveMessage({
              id: `msg_${Date.now()}`,
              content: data.message,
              researched_insights: data.learning_stats
                ? Object.entries(data.learning_stats).map(
                    ([k, v]) => `${k}: ${JSON.stringify(v)}`
                  )
                : undefined,
            });
          }
        }
      } catch {
        console.debug("[IntentIQ] Failed to send tracking data");
      }
    },
    []
  );

  // Send page data on navigation when visitor is identified
  useEffect(() => {
    pageEnteredAt.current = Date.now();

    return () => {
      if (!visitorInfo) return;
      const durationSec = Math.round(
        (Date.now() - pageEnteredAt.current) / 1000
      );
      sendPageData(visitorInfo, location.pathname, durationSec);
    };
  }, [location.pathname, visitorInfo, sendPageData]);

  // Send on unload
  useEffect(() => {
    const handleUnload = () => {
      if (!visitorInfo) return;
      const durationSec = Math.round(
        (Date.now() - pageEnteredAt.current) / 1000
      );
      // Use sendBeacon for reliability on unload
      const payload = JSON.stringify({
        name: visitorInfo.name,
        email: visitorInfo.email,
        company: visitorInfo.company,
        page: location.pathname,
        time_on_page: durationSec,
      });
      navigator.sendBeacon?.(
        `${API_URL}/api/process-visitor`,
        new Blob([payload], { type: "application/json" })
      );
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [visitorInfo, location.pathname]);

  const identifyVisitor = useCallback(
    (info: VisitorInfo) => {
      storeVisitor(info);
      setVisitorInfo(info);
      setShowForm(false);
      // Immediately send current page
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
  };
}
