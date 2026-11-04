# DDACC Action Items & Task Tracker

## Immediate Tasks (v0.2.x)
- [x] Integrate `/api/applications` with schema-compliant payload intake.
- [x] Wire `/api/wall` with character counter and optimistic UI updates.
- [x] Wire `/api/schedule` search query and day filter parameters.
- [x] Add floating System Tray Dock with interactive server actions.
- [x] Add accessible tooltips (`Tooltip.tsx`) to form fields and operational metrics.
- [x] Verify production build (`npm run build`) and strict linting (`npm run lint`).
- [ ] Connect production Postgres/SQLite database layer for persistent storage beyond memory state.
- [ ] Implement rate-limiting middleware for `/api/wall` and `/api/applications`.

## Short-Term Polish
- [ ] Add sound effects toggle (synthesizer bleeps) for dashboard interactions.
- [ ] Add CSV export for approved Artist Alley applications.
- [ ] Add calendar file (`.ics`) download for bookmarked schedule sessions.
