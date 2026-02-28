

# Demo-Ready Polish Pass

## Issues Found

### 1. index.html has Lovable boilerplate (HIGH)
The browser tab shows "Lovable App" and all meta/OG tags reference Lovable instead of IntentIQ. TODO comments are visible in source. This is the first thing a recruiter sees in their browser tab.

**Fix:** Update title to "IntentIQ -- AI-Powered Visitor Intent Detection", description, OG tags, and remove TODO comments.

### 2. Navbar buttons are non-functional (HIGH)
"Log in" and "Start Free Trial" buttons do nothing when clicked. A recruiter clicking these will think the site is broken.

**Fix:** Make "Start Free Trial" link to `/pricing`. Make "Log in" show a toast saying "Demo mode -- authentication is simulated" (honest and professional).

### 3. Footer has dead links (MEDIUM)
About, Blog, Careers, Privacy, Terms, Security are all `<span>` elements with `cursor-default` -- they look like links but go nowhere.

**Fix:** Remove these placeholder items or add a subtle "(Coming soon)" label. Cleaner option: collapse Footer to just Product links (Pricing, Docs, Dashboard) and the brand, removing fake sections entirely.

### 4. CTA Section background grid overflow (LOW)
The `bg-grid absolute inset-0` div in CtaSection has no `relative` on its parent `<section>`, so the grid pattern may bleed outside bounds.

**Fix:** Add `relative overflow-hidden` to the section wrapper.

### 5. API errors when backend is cold/down (MEDIUM)
The Render backend cold-starts cause console errors and the proactive widget may not appear for 30-60s. For a demo, silent failures are fine, but we should ensure no ugly error toasts appear.

**Fix:** Already handled with try/catch and `console.debug`. Confirmed no user-facing errors -- no change needed.

### 6. NotFound page uses min-h-screen outside Layout (LOW)
The 404 page renders outside `<Layout>` so it has no navbar/footer, which is jarring.

**Fix:** Wrap the catch-all route inside the Layout route so 404 pages still show nav and footer.

---

## Files to Change

| File | Change |
|------|--------|
| `index.html` | Update title, meta tags, OG tags, remove TODO comments |
| `src/components/Navbar.tsx` | Wire up "Log in" (toast) and "Start Free Trial" (link to /pricing) |
| `src/components/Footer.tsx` | Remove fake Company/Legal sections, keep only real links |
| `src/components/landing/CtaSection.tsx` | Add `relative overflow-hidden` to section |
| `src/App.tsx` | Move NotFound route inside Layout |

