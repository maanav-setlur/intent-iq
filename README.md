# IntentIQ: Closing the Intent Gap with Autonomous Research Agents

> **⚠️ Hackathon Project:** IntentIQ is a **fictional company** built as a submission for the **Continual Learning Hackathon with Intercom AI**. It is not a real product or service.

## What is IntentIQ?

Most B2B websites lose **96% of visitors** without ever knowing who they were or what they wanted. IntentIQ solves this by combining **real-time behavioral intent detection** with **AI-powered autonomous research agents** to identify, enrich, and engage high-intent visitors before they bounce.

## Key Features

- **Real-time Visitor Behavior Tracking** — Monitors scroll depth, time on page, navigation patterns, and session history to build a live intent score
- **Intent Scoring Pipeline** — Classifies visitors into low / medium / high intent tiers and triggers appropriate engagement
- **Gated Content Lead Capture** — White paper downloads and interactive demo requests capture name, email, and company
- **AI-Powered Company Research & Enrichment** — Autonomous agents research the visitor's company using public data sources
- **Personalized Outreach Email Generation** — AI drafts tailored outreach based on the visitor's behavior and company profile
- **Proactive Messaging Widget** — Intent-aware widget adapts its messaging, styling, and CTAs based on visitor engagement level
- **Interactive Demo Dashboard** — Live activity feed, intent distribution charts, and learning insights panel

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts |
| **Backend** | FastAPI (Python), You.com API, Google Gemini / GPT-4, Apollo/Clearbit |
| **Hosting** | Lovable (frontend), Render (backend API) |

## Project Structure

```
src/
├── components/
│   ├── landing/          # Hero, features, testimonials, CTA sections
│   ├── dashboard/        # Metrics, charts, activity feed, research examples
│   ├── GatedContentModal.tsx        # Lead capture modal (white paper / demo)
│   ├── VisitorIdentificationForm.tsx # Intent-aware identification form
│   └── ProactiveMessageWidget.tsx   # Adaptive engagement widget
├── hooks/
│   ├── useBehaviorTracking.ts  # Collects scroll, navigation, and session data
│   ├── useVisitorTracking.ts   # Sends behavioral data to backend for scoring
│   └── useLeadCapture.ts       # Submits lead data with behavioral context
├── pages/
│   ├── Index.tsx       # Landing page
│   ├── Dashboard.tsx   # Analytics demo dashboard
│   ├── Demo.tsx        # Interactive product demo
│   ├── Docs.tsx        # Documentation
│   └── Pricing.tsx     # Pricing page
```

## Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## How It Works

1. **Track** — A visitor lands on the site. Behavioral signals (scroll depth, pages viewed, time spent, referrer) are collected in real time.
2. **Score** — The backend scores the visitor's intent level (low / medium / high) based on accumulated behavioral data.
3. **Engage** — Based on intent level, a proactive message or identification form is triggered with tailored copy and CTAs.
4. **Capture** — When the visitor submits their info (via the widget or gated content), their data is enriched with company research.
5. **Outreach** — AI generates a personalized outreach email using the visitor's behavior patterns and enriched company profile.

## Live Demo

👉 [https://intent-pulse-engage.lovable.app](https://intent-pulse-engage.lovable.app)

---

*Built with ❤️ for the Continual Learning Hackathon with Intercom AI*
