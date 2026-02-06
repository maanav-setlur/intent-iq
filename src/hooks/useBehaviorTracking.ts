import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

const SESSION_PAGES_KEY = "intentiq_session_pages";
const RETURN_VISITOR_KEY = "intentiq_visited_before";

export interface BehaviorData {
  pages_visited: string[];
  scroll_depth: number;
  session_page_count: number;
  is_return_visitor: boolean;
  referrer: string;
}

function getSessionPages(): string[] {
  try {
    const raw = sessionStorage.getItem(SESSION_PAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSessionPage(page: string) {
  const pages = getSessionPages();
  if (!pages.includes(page)) {
    pages.push(page);
    sessionStorage.setItem(SESSION_PAGES_KEY, JSON.stringify(pages));
  }
}

export function useBehaviorTracking() {
  const location = useLocation();
  const maxScrollDepth = useRef(0);
  const referrer = useRef(document.referrer || "");

  // Mark return visitor
  useEffect(() => {
    const visited = localStorage.getItem(RETURN_VISITOR_KEY);
    if (!visited) {
      // Set flag for future visits (delayed so current visit counts as first)
      setTimeout(() => localStorage.setItem(RETURN_VISITOR_KEY, "1"), 5000);
    }
  }, []);

  // Track pages visited in session
  useEffect(() => {
    addSessionPage(location.pathname);
  }, [location.pathname]);

  // Track scroll depth (throttled), reset on page change
  useEffect(() => {
    maxScrollDepth.current = 0;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const depth = Math.round((scrollTop / docHeight) * 100);
          if (depth > maxScrollDepth.current) {
            maxScrollDepth.current = depth;
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const getBehaviorData = useCallback((): BehaviorData => {
    const pages = getSessionPages();
    return {
      pages_visited: pages,
      scroll_depth: maxScrollDepth.current,
      session_page_count: pages.length,
      is_return_visitor: localStorage.getItem(RETURN_VISITOR_KEY) === "1",
      referrer: referrer.current,
    };
  }, []);

  return { getBehaviorData };
}
