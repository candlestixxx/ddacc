# DDACC Action Items & Task Tracker

## Immediate Tasks (v0.2.x)
- [x] Integrate `/api/applications` with schema-compliant payload intake.
- [x] Wire `/api/wall` with character counter and optimistic UI updates.
- [x] Wire `/api/schedule` search query and day filter parameters.
- [x] Add floating System Tray Dock with interactive server actions.
- [x] Add accessible tooltips (`Tooltip.tsx`) to form fields and operational metrics.
- [x] Verify production build (`npm run build`) and strict linting (`npm run lint`).
- [x] Implement rate-limiting middleware for `/api/wall` and `/api/applications` (`src/lib/rateLimit.ts`).
- [x] Add CSV export for approved Artist Alley applications (`/api/applications/export`).
- [x] Add calendar file (`.ics`) download for bookmarked schedule sessions (`/api/schedule/export`).
- [x] Implement Digital Badge Pass Generator & Huntington Place QR Check-in System (`src/lib/badge.ts`, `/api/badge/verify`, `BadgePassModal.tsx`).
- [x] Implement Interactive Huntington Place CAD Floorplan & Stage Navigator (`src/components/VenueMap.tsx`, `/api/venue`) with level filtering, live occupancy meters, and track affinity badges.
- [ ] Connect production Postgres/SQLite database layer for persistent storage beyond memory state.

## Short-Term Polish
- [x] Add sound effects toggle (synthesizer bleeps) for dashboard interactions (`src/lib/audio.ts` & `src/components/AudioToggle.tsx`).
- [x] Add simulated QR turnstile scanner with audio chime feedback on pass verification.
- [ ] Implement WebSocket server adapter for immediate Digital Wall live syncing across multiple client display terminals.
