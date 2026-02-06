

## Connect to Valeria's Backend

Wire up the visitor tracking system to the live backend at `https://intent-agent-backend.onrender.com`.

### What will change

A single environment variable will be added so the tracking hook starts sending data to Valeria's API:

- **File:** `src/hooks/useVisitorTracking.ts`
- **Change:** Update the fallback value in the `API_URL` constant from an empty string to `https://intent-agent-backend.onrender.com`

This means the existing `flush` function will now POST page-view events to `https://intent-agent-backend.onrender.com/api/track-behavior`, and when the backend returns `threshold_triggered: true`, the proactive message widget will appear automatically.

No other files need to change -- the tracking hook, layout, and widget are already fully wired together.

### Technical detail

```text
Before:  const API_URL = import.meta.env.VITE_TRACKING_API_URL || "";
After:   const API_URL = import.meta.env.VITE_TRACKING_API_URL || "https://intent-agent-backend.onrender.com";
```

The environment variable override is preserved so you can still switch endpoints without touching code.

