import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const CodeBlock = ({ code, lang = "javascript" }: { code: string; lang?: string }) => (
  <pre className="overflow-x-auto rounded-xl border bg-foreground/[0.03] p-4 text-sm leading-relaxed">
    <code>{code}</code>
  </pre>
);

const trackingSnippet = `// Install the IntentIQ tracking snippet
<script src="https://cdn.intentiq.com/tracker.js"
  data-site-id="YOUR_SITE_ID"
  async>
</script>`;

const apiExample = `// Send tracking events via REST API
const response = await fetch("https://api.intentiq.com/api/track-behavior", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    visitor_id: "vis_abc123",
    company_domain: null,
    session_id: "ses_xyz789",
    events: [
      {
        type: "page_view",
        page: "/pricing",
        timestamp: "2024-02-06T10:45:00Z",
        duration_seconds: 45
      }
    ]
  })
});

const data = await response.json();
// {
//   success: true,
//   intent_score: 75,
//   threshold_triggered: true,
//   message: {
//     id: "msg_123",
//     content: "Looks like you're evaluating our pricing...",
//     researched_insights: ["You visited pricing 3 times", "..."]
//   }
// }`;

const webhookExample = `// Webhook payload sent to your endpoint
// when a visitor crosses the intent threshold

{
  "event": "intent_threshold_reached",
  "visitor_id": "vis_abc123",
  "intent_score": 82,
  "company": {
    "name": "Acme Corp",
    "domain": "acme.com",
    "industry": "SaaS"
  },
  "session": {
    "pages_viewed": ["/", "/pricing", "/docs"],
    "total_duration_seconds": 340,
    "return_visits": 3
  },
  "recommended_action": "Send personalized outreach",
  "timestamp": "2024-02-06T10:50:00Z"
}`;

const sdkExample = `import { IntentIQ } from "@intentiq/sdk";

const iq = new IntentIQ({
  siteId: "YOUR_SITE_ID",
  apiKey: "YOUR_API_KEY",
});

// Track custom events
iq.track("button_click", {
  element: "cta_hero",
  page: "/pricing",
});

// Listen for intent threshold
iq.on("threshold_reached", (data) => {
  console.log("High intent visitor!", data.intent_score);
  // Show custom engagement UI
});

// Get current visitor score
const score = await iq.getIntentScore();
console.log("Current intent:", score); // 75`;

const endpoints = [
  {
    method: "POST",
    path: "/api/track-behavior",
    description: "Send visitor tracking events. Returns intent score and optional proactive message.",
  },
  {
    method: "GET",
    path: "/api/visitors/:id",
    description: "Retrieve visitor profile including historical intent scores and session data.",
  },
  {
    method: "GET",
    path: "/api/visitors/:id/sessions",
    description: "List all sessions for a visitor with page views and duration metrics.",
  },
  {
    method: "POST",
    path: "/api/webhooks",
    description: "Register a webhook URL to receive real-time intent threshold notifications.",
  },
  {
    method: "DELETE",
    path: "/api/webhooks/:id",
    description: "Remove a registered webhook endpoint.",
  },
];

export default function Docs() {
  return (
    <section className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <h1 className="text-4xl font-extrabold tracking-tight">Documentation</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Everything you need to integrate IntentIQ into your product.
        </p>

        <Tabs defaultValue="quickstart" className="mt-10">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="sdk">SDK</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="mt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Quick Start</h2>
              <p className="mt-2 text-muted-foreground">
                Get up and running in under 2 minutes with our tracking snippet.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">1. Add the tracking snippet</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Paste this snippet before the closing <code className="rounded bg-muted px-1.5 py-0.5 text-xs">&lt;/body&gt;</code> tag on every page you want to track.
              </p>
              <CodeBlock code={trackingSnippet} />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">2. Send events via API</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                For server-side tracking or custom integrations, use the REST API directly.
              </p>
              <CodeBlock code={apiExample} />
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">API Reference</h2>
              <p className="mt-2 text-muted-foreground">
                Base URL: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">https://api.intentiq.com</code>
              </p>
            </div>

            <div className="space-y-4">
              {endpoints.map((ep) => (
                <div key={ep.path + ep.method} className="rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-bold",
                        ep.method === "POST" && "bg-accent/15 text-accent",
                        ep.method === "GET" && "bg-primary/15 text-primary",
                        ep.method === "DELETE" && "bg-destructive/15 text-destructive"
                      )}
                    >
                      {ep.method}
                    </span>
                    <code className="text-sm font-medium">{ep.path}</code>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{ep.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Example: Track Behavior</h3>
              <CodeBlock code={apiExample} />
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Webhooks</h2>
              <p className="mt-2 text-muted-foreground">
                Receive real-time notifications when visitors cross intent thresholds.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Webhook Payload</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                When a visitor's intent score exceeds your configured threshold, we'll POST the following payload to your registered endpoint.
              </p>
              <CodeBlock code={webhookExample} lang="json" />
            </div>
          </TabsContent>

          <TabsContent value="sdk" className="mt-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">JavaScript SDK</h2>
              <p className="mt-2 text-muted-foreground">
                Use our SDK for a richer client-side integration with event listeners and real-time scoring.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Installation</h3>
              <CodeBlock code={`npm install @intentiq/sdk`} />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Usage</h3>
              <CodeBlock code={sdkExample} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
