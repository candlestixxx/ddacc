# CHANGELOG

All notable changes to the Detroit Digital Artist Convention & Conference (DDACC) platform are documented in this file.
The single source of truth for the project version is `VERSION.md`.

## [0.2.0] - 2026-03-29

### Major Architecture & Unified Dashboard Overhaul
- **Consolidated Single-Page Experience (`src/app/page.tsx`)**:
  - Re-architected fragmented pages into a single, cohesive, high-impact dashboard experience organized by high-value hierarchy.
  - Added hero quick actions with jump navigation (`01. Vision & Ethos`, `02. Curated Tracks`, `03. Program Schedule`, `04. Artist Portal`, `05. Digital Wall`).
  - Added high-visibility stats metric cards (Sessions, Creators, Attendees, Live Nodes).
  - Integrated rich curated tracks section displaying Track details, target equipment, and badges.
- **System Tray Dock (`src/components/SystemTrayDock.tsx`)**:
  - Created a floating, persistent system tray widget at the bottom right with live server health indicator (`ONLINE`, `DEGRADED`, `DISCONNECTED`).
  - Implemented popover controls with real-time uptime clock, active websocket connection counters, active services monitor (Schedule, Artist Alley, Wall Sync, Projections).
  - Added operational actions: Restart Server, Flush Cache, View Stream Logs, Export CSV, and Test Shutdown mode.
  - Added sticky top navigation status indicator linking to system tray.
- **Universal Tooltip Infrastructure (`src/components/Tooltip.tsx`)**:
  - Added an accessible, keyboard-navigable (`Tab` / `focus` / `hover`) tooltip component with distinct information markers (`ℹ`).
  - Placed tooltip guidance throughout schedule filtering, artist alley requirements, Love Collective pledge, and server operations.
- **API Route Handlers, Exports & Security Guardrails**:
  - `GET /api/schedule`: Live JSON schedule with search, day filtering, and track filtering.
  - `GET /api/schedule/export`: RFC 5545-compliant `.ics` iCalendar feed generator for personal agenda or complete program sync.
  - `GET /api/applications` & `POST /api/applications`: Artist Alley and Speaker proposal submission handler with rate limiting (5 req/min per client IP) and schema validation.
  - `GET /api/applications/export`: Downloadable CSV export of submitted applications.
  - `GET /api/wall` & `POST /api/wall`: Real-time collaborative community wall with rate limiting (15 req/min per client IP), category tagging, and like counter increments.
  - `GET /api/system/status`: Server health check and operations diagnostic endpoint.
  - `src/lib/rateLimit.ts`: In-memory sliding-window token-bucket rate limiter.
- **Enhanced Interactive Components**:
  - `Schedule.tsx`: Added instant keyword search, bookmark toggling with local storage memory, track badge color coding, modal session detail view, and direct `.ics` agenda calendar export button.
  - `ArtistPortal.tsx`: Multi-select art medium badges, portfolio URL verification, technical requirement notes, and Love Collective pledge checkbox with submission state handling.
  - `DigitalWall.tsx`: Note filtering by tag (`All`, `General`, `Art Tip`, `Collaboration`, `Shoutout`), character counter (280 max), and immediate optimistic UI updates.
- **Version Governance**:
  - Sourced versioning globally from `VERSION.md` (v0.2.0).

## [0.1.0] - 2026-03-28
### Initial Release
- Initial DDACC landing page structure.
- Baseline schema definitions for schedule, artists, and live wall.
- Next.js 16 + Tailwind CSS foundation.
