

# IntentIQ - Intelligent Visitor Tracking Demo Website

## Overview
A polished B2B SaaS demo website that showcases intelligent visitor tracking and proactive messaging. The site will track visitor behavior in real-time, calculate intent scores, and display personalized slide-in notifications when high intent is detected.

---

## Pages

### 1. Home Page (/)
- **Hero section** with headline, subtitle, and CTA button — modern gradient aesthetic inspired by Stripe/Linear
- **Features overview** section with 3-4 feature cards (visitor tracking, intent scoring, proactive messaging, etc.)
- **Social proof / How it works** section
- **Final CTA** section

### 2. Pricing Page (/pricing)
- **3-tier pricing table**: Starter, Professional, Enterprise
- Feature comparison list per tier
- Highlighted "most popular" tier
- CTA buttons on each plan

### 3. Documentation Page (/docs)
- API reference with endpoint descriptions
- Code examples with syntax-highlighted blocks (tracking API, webhook setup, etc.)
- Clean sidebar or tabbed navigation for doc sections

---

## Core Functionality

### Visitor Behavior Tracking (`useVisitorTracking` hook)
- Generates a unique `visitor_id` on first visit, persisted in `localStorage`
- Creates a `session_id` per browser session
- Tracks every page navigation as a `page_view` event
- Measures time spent on each page using `useEffect` cleanup
- Batches events and sends them to `POST /api/track-behavior`
- Backend API URL pulled from environment variable
- Graceful error handling for offline/failed requests

### Proactive Message Widget
- Listens for `threshold_triggered: true` in API responses
- Slides in from the bottom-right corner with smooth animation
- Displays the personalized message content
- Shows `researched_insights` as bullet points
- Close button + auto-dismiss after 10 seconds
- Styled as an elevated card with modern chat notification aesthetics

---

## Design & Styling
- **Color scheme**: Blue/purple primary, green accent for CTAs, clean whites and grays
- **Typography**: Clean, professional, generous whitespace
- **Responsive**: Fully mobile-friendly across all pages
- **Animations**: Smooth page transitions and widget slide-in effects
- **Aesthetic**: Modern B2B SaaS look (Stripe, Linear, Vercel inspired)

---

## Technical Architecture
- React Router for page navigation
- Custom `useVisitorTracking()` hook encapsulating all tracking logic
- Environment variable for backend API URL
- `localStorage` for visitor ID persistence
- All tracking data formatted per the specified API schema
- No backend needed in Lovable — the app will make API calls to the external backend endpoint

