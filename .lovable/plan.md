

## Smarter Client-Side Intent Classification

### What Changes

Update the `inferIntentLevel` function in `src/hooks/useVisitorTracking.ts` to use a **points-based scoring system** instead of simple if/else checks. This incorporates scroll depth, time on page, and referrer source alongside the existing page visit and return visitor signals.

### Scoring System

Each behavioral signal contributes points:

| Signal | Condition | Points |
|---|---|---|
| Visited /pricing | true | +3 |
| Return visitor | true | +2 |
| Pages visited | 2+ pages | +1 |
| Pages visited | 3+ pages | +2 |
| Scroll depth | > 60% | +1 |
| Scroll depth | > 85% | +2 |
| Time on page | > 30s | +1 |
| Time on page | > 60s | +2 |
| Referrer | Google/LinkedIn/Bing | +2 |

Intent thresholds:
- **High**: 5+ points
- **Medium**: 2-4 points
- **Low**: 0-1 points

### Technical Details

**`src/hooks/useVisitorTracking.ts`**
- Update `inferIntentLevel` signature to accept scroll depth, time on page, and referrer in addition to pages visited and return visitor flag
- Implement the points-based scoring logic
- Update the two call sites (in the API success handler and the catch fallback) to pass the additional parameters from `getBehaviorData()`

**`src/hooks/useBehaviorTracking.ts`** -- No changes needed. It already tracks `scroll_depth` and `referrer` and exposes them via `getBehaviorData()`.

### Examples

- First-time visitor, 1 page, 10s, 20% scroll --> 0 points --> **Low**
- Return visitor, 2 pages, 25s, 50% scroll --> 3 points --> **Medium**
- First-time visitor from Google, on /pricing, 45s, 70% scroll --> 3+1+1+2 = 7 points --> **High**
- Return visitor, 3 pages including /pricing, 35s --> 2+2+3+1 = 8 points --> **High**

