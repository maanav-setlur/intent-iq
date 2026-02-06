

## White Paper / Demo Gated Content with AI-Powered Outreach

### What We're Building

Two new CTAs on the site -- "Download White Paper" and "Try Demo" -- that open a modal asking for name, email, and company. After submission, the data is sent to your backend, where your AI agent researches the visitor's company (funding rounds, ARR, etc.) and generates a personalized outreach email for you.

### Frontend Changes (Lovable)

**1. New GatedContentModal component**
- A reusable dialog (using the existing Radix Dialog) with two modes: "whitepaper" and "demo"
- Each mode shows different copy (e.g., "Download Our Intent Intelligence White Paper" vs "Try the Interactive Demo")
- Form fields: Name, Email, Company (validated with Zod, same pattern as the existing VisitorIdentificationForm)
- On submit, POST to your backend at `/api/capture-lead` with `{ name, email, company, content_type: "whitepaper" | "demo" }`
- Show a success state ("Check your email!" for whitepaper, redirect to a demo page for demo)
- No data stored in localStorage -- this is server-only storage

**2. Place CTAs on key pages**
- Homepage hero section: Add "Download White Paper" and "Try Demo" buttons alongside existing CTAs
- Docs page: Add a sidebar or banner CTA
- Pricing page: Add a CTA near the pricing cards

**3. New /demo route (optional)**
- A simple interactive demo page that the visitor is redirected to after submitting the demo form
- Could show the dashboard in a read-only/mock mode

**4. Update useVisitorTracking hook**
- After a gated content submission, send the lead data alongside the existing behavioral tracking payload so the backend has full context

### Backend Changes (Your Engineer -- app.py)

**5. New `/api/capture-lead` endpoint**
- Accepts: `{ name, email, company, content_type, behavioral_context? }`
- Stores the lead in your database (new `leads` table)
- Triggers the AI research + outreach pipeline (can be async/background job)

**6. AI Research Agent (new module or function)**
- Input: company name + visitor name
- Steps:
  - Search for the company using an API (e.g., Crunchbase, Apollo, Clearbit, or web scraping)
  - Gather: recent funding rounds, estimated ARR, employee count, industry, tech stack
  - Combine with behavioral data (pages visited, intent score, time on site)
- Output: structured company profile object

**7. Outreach Generation**
- Use an LLM (e.g., OpenAI GPT-4) to generate a personalized outreach email
- Template inputs: visitor name, company profile, behavioral signals, content they requested
- Store the generated email in the database for your review
- Optionally send you a notification (email/Slack) with the draft

**8. requirements.txt additions**
- `openai` (for LLM outreach generation)
- An enrichment API client (e.g., `apollo-api`, `clearbit`, or `requests` for custom API calls)

### Technical Details

```text
Frontend Flow:
  Visitor clicks "Download White Paper"
    --> GatedContentModal opens
    --> Fills name/email/company
    --> POST /api/capture-lead
    --> Success state shown
    --> Whitepaper PDF link revealed or emailed

Backend Flow:
  /api/capture-lead receives lead
    --> Save to DB (leads table)
    --> Async: research_company(company_name)
       --> Query enrichment API (Crunchbase/Apollo/Clearbit)
       --> Return { funding, arr, headcount, industry }
    --> Async: generate_outreach(visitor, company_profile, behavior)
       --> LLM generates personalized email draft
       --> Save draft to DB
       --> Notify you (email/Slack webhook)
```

### Files to Create/Modify (Frontend)

| File | Action |
|------|--------|
| `src/components/GatedContentModal.tsx` | Create -- modal with form for whitepaper/demo |
| `src/pages/Index.tsx` | Modify -- add CTA buttons that open the modal |
| `src/pages/Docs.tsx` | Modify -- add a CTA banner |
| `src/hooks/useVisitorTracking.ts` | Modify -- add `captureLead()` function that POSTs to backend |
| `src/pages/Demo.tsx` | Create (optional) -- interactive demo page |
| `src/App.tsx` | Modify -- add /demo route if demo page is created |

### What Your Engineer Needs to Build (Backend)

| Item | Description |
|------|-------------|
| `POST /api/capture-lead` | New endpoint to receive and store lead data |
| `leads` DB table | Store name, email, company, content_type, timestamp, intent_score |
| Company research function | Query enrichment APIs for funding, ARR, headcount |
| Outreach generator | LLM-powered personalized email draft |
| Notification system | Email or Slack alert with the generated outreach draft |
| CORS for new endpoint | Same `flask-cors` setup as existing endpoints |

