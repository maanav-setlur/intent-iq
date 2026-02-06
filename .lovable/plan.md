

# Smart Intent-Based Visitor Engagement

## Goal
Transform the current generic visitor identification form and proactive message widget into an intelligent engagement system that:
1. Detects visitor behavior (pages visited, time spent, scroll depth)
2. Sends behavioral signals to the backend for intent scoring
3. Displays **contextual, persuasive messages** based on the visitor's intent level and browsing behavior to nudge them toward starting a free trial

## Current State
- The visitor form asks for name/email/company upfront after 5 seconds -- this is friction before value
- The proactive widget shows a generic message from the backend, with no differentiation for intent level
- Behavioral signals (which pages, how long) are sent only as `page` + `time_on_page`
- No tracking of scroll depth, CTA hover, return visits, or pricing page engagement

## What Changes

### 1. Smarter Behavioral Tracking (useVisitorTracking.ts)
- Track richer signals: pages visited in session, scroll depth, CTA interactions, return visit detection (via localStorage)
- Send enriched data to `POST /api/process-visitor` so the backend can make better intent decisions
- **Delay the identification form** -- instead of prompting at 5 seconds, wait until the backend returns a high-intent signal or the visitor has viewed 2+ pages

### 2. Intent-Aware Proactive Widget (ProactiveMessageWidget.tsx)
- Redesign the widget to support **three tiers** of engagement based on what the backend returns:
  - **Low intent**: Subtle, non-intrusive nudge (e.g., "See how teams like yours use IntentIQ")
  - **Medium intent**: Value-focused message with a soft CTA (e.g., "Want to see this in action? Try free for 14 days")
  - **High intent**: Urgent, personalized message with a prominent "Start Free Trial" button and any researched insights the backend provides
- Add a CTA button inside the widget that links to `/pricing` or triggers the free trial flow
- Auto-dismiss timing adjusts by tier: low = 8s, medium = 15s, high = stays until dismissed

### 3. Delayed Visitor Identification
- Instead of a cold form at 5 seconds, the identification form appears **only when the backend flags the visitor as worth engaging** (medium/high intent)
- The form copy changes based on context: "Get a personalized demo" for high intent vs "Stay in the loop" for medium
- Anonymous behavioral tracking continues without identification

### 4. Backend Data Contract Update
- Enrich the `POST /api/process-visitor` payload with:
  - `pages_visited`: array of pages seen this session
  - `scroll_depth`: 0-100 percentage on current page
  - `session_page_count`: total pages in session
  - `is_return_visitor`: boolean
  - `referrer`: document.referrer
- Expect the backend response to include an `intent_level` field (`"low"` | `"medium"` | `"high"`) alongside the existing `message`

---

## Technical Details

### Files to Create
- `src/hooks/useBehaviorTracking.ts` -- Lightweight hook that tracks scroll depth, pages visited in session (stored in sessionStorage), and return visit flag (localStorage). Exposes a `getBehaviorData()` function.

### Files to Modify

**`src/hooks/useVisitorTracking.ts`**
- Import and use `useBehaviorTracking` to enrich the payload sent to `/api/process-visitor`
- Add `intent_level` to the `ProactiveMessage` interface (from backend response)
- Change form trigger logic: instead of a 5-second timer, show the form only when the backend response indicates medium/high intent AND visitor is not yet identified
- Send behavior data (pages visited, scroll depth, return visitor flag) in every API call

**`src/components/ProactiveMessageWidget.tsx`**
- Accept `intent_level` on the message prop
- Render different visual styles per tier:
  - Low: minimal bottom bar, muted colors, no CTA button
  - Medium: current card style with a "Try Free" secondary button
  - High: emphasized card with accent border/glow, prominent "Start Free Trial" button, and researched insights list
- Adjust auto-dismiss timeout based on intent level
- CTA button navigates to `/pricing` using react-router

**`src/components/VisitorIdentificationForm.tsx`**
- Accept an optional `intentLevel` prop to adjust copy
- High intent: heading says "Get Your Personalized Demo", button says "Book Demo"
- Medium intent: heading says "Unlock Personalized Insights", button stays as-is

**`src/components/Layout.tsx`**
- Pass `intent_level` through from the tracking hook to the widget and form components

### Behavior Tracking Details

The new `useBehaviorTracking` hook will:
- Listen to `scroll` events (throttled) to track max scroll depth on the current page
- Maintain a `sessionStorage` list of pages visited this session
- Check `localStorage` for a `intentiq_visited_before` flag to detect return visitors
- Read `document.referrer` once on mount
- Expose `getBehaviorData()` returning `{ pages_visited, scroll_depth, session_page_count, is_return_visitor, referrer }`

### Enriched API Payload
```text
POST /api/process-visitor
{
  "name": "...",           // empty string if anonymous
  "email": "...",          // empty string if anonymous
  "company": "...",        // empty string if anonymous
  "page": "/pricing",
  "time_on_page": 45,
  "pages_visited": ["/", "/pricing"],
  "scroll_depth": 72,
  "session_page_count": 2,
  "is_return_visitor": true,
  "referrer": "https://google.com"
}
```

### Expected Backend Response (updated)
```text
{
  "message": "Looks like you're evaluating our pricing...",
  "intent_level": "high",
  "learning_stats": { ... },
  "cta": {
    "label": "Start Free Trial",
    "url": "/pricing"
  }
}
```

If the backend doesn't yet return `intent_level`, the frontend will infer it from behavioral signals client-side as a fallback (e.g., visited pricing page + 2 other pages + return visitor = high).

