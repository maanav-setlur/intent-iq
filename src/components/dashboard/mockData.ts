export interface Activity {
  id: string;
  timestampOffset: number; // seconds ago
  eventType: "researching" | "message_sent" | "reply_received";
  company: string;
  intentScore: number;
  action: string;
  insights?: string;
}

export const activities: Activity[] = [
  {
    id: "1",
    timestampOffset: 5,
    eventType: "reply_received",
    company: "stripe.com",
    intentScore: 92,
    action: "Demo request confirmed for Thursday",
    insights: "Series-D, 8K employees, expanding APAC sales team",
  },
  {
    id: "2",
    timestampOffset: 45,
    eventType: "message_sent",
    company: "notion.so",
    intentScore: 78,
    action: "Sent personalized ROI breakdown email",
  },
  {
    id: "3",
    timestampOffset: 120,
    eventType: "researching",
    company: "linear.app",
    intentScore: 65,
    action: "Gathering competitive landscape data",
    insights: "Recently raised Series-B, hiring 3 sales roles",
  },
  {
    id: "4",
    timestampOffset: 300,
    eventType: "message_sent",
    company: "figma.com",
    intentScore: 85,
    action: "Follow-up with case study attachment",
  },
  {
    id: "5",
    timestampOffset: 480,
    eventType: "reply_received",
    company: "vercel.com",
    intentScore: 71,
    action: "Positive reply — scheduling call",
    insights: "VP Sales mentioned budget approval Q1",
  },
  {
    id: "6",
    timestampOffset: 900,
    eventType: "researching",
    company: "datadog.com",
    intentScore: 34,
    action: "Initial prospect research",
  },
  {
    id: "7",
    timestampOffset: 1500,
    eventType: "message_sent",
    company: "planetscale.com",
    intentScore: 55,
    action: "Cold outreach with industry insight hook",
    insights: "Competitor churn signal detected",
  },
];

export interface ResearchCard {
  company: string;
  insights: string[];
  sources: string[];
  timestampOffset: number;
}

export const researchCards: ResearchCard[] = [
  {
    company: "stripe.com",
    insights: [
      "Expanding APAC sales org — 12 open roles",
      "CEO quoted on revenue tooling gaps at SaaStr",
      "Current vendor contract renews in 60 days",
    ],
    sources: ["TechCrunch", "LinkedIn", "G2"],
    timestampOffset: 45,
  },
  {
    company: "notion.so",
    insights: [
      "Launched enterprise tier last quarter",
      "VP Revenue joined from Salesforce",
      "Active RFP for intent data providers",
    ],
    sources: ["LinkedIn", "Crunchbase", "Twitter/X"],
    timestampOffset: 180,
  },
  {
    company: "linear.app",
    insights: [
      "Series-B closed at $35M",
      "Hiring 3 sales leadership roles",
      "CTO spoke about scaling GTM at Config 2024",
    ],
    sources: ["Crunchbase", "LinkedIn", "YouTube"],
    timestampOffset: 600,
  },
];

export function formatTimeAgo(secondsAgo: number): string {
  if (secondsAgo < 10) return "Just now";
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
  return `${Math.floor(secondsAgo / 3600)}h ago`;
}
