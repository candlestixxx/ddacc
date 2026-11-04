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
  - Added operational actions: Restart Server, Flush Cache, View Stream Logs, and Test Shutdown mode.
  - Added sticky top navigation status indicator linking to system tray.
- **Universal Tooltip Infrastructure (`src/components/Tooltip.tsx`)**:
  - Added an accessible, keyboard-navigable (`Tab` / `focus` / `hover`) tooltip component with distinct information markers (`ℹ`).
  - Placed tooltip guidance throughout schedule filtering, artist alley requirements, Love Collective pledge, and server operations.
- **API Route Handlers**:
  - `GET /api/schedule`: Live JSON schedule with search, day filtering, and track filtering.
  - `GET /api/applications` & `POST /api/applications`: Artist Alley and Speaker proposal submission handler validating against JSON schemas with duplicate handling.
  - `GET /api/wall` & `POST /api/wall`: Real-time collaborative community wall with category tagging and like counter increments.
  - `GET /api/system/status`: Server health check and operations diagnostic endpoint.
- **Enhanced Interactive Components**:
  - `Schedule.tsx`: Added instant keyword search, bookmark toggling with local storage memory, track badge color coding, and modal session detail view.
  - `ArtistPortal.tsx`: Multi-select art medium badges, portfolio URL verification, technical requirement notes, and Love Collective pledge checkbox with submission state handling.
  - `DigitalWall.tsx`: Note filtering by tag (`All`, `General`, `Art Tip`, `Collaboration`, `Shoutout`), character counter (280 max), and immediate optimistic UI updates.
- **Version Governance**:
  - Sourced versioning globally from `VERSION.md` (v0.2.0).

## [0.1.0] - 2026-03-28
### Initial Release
- Initial DDACC landing page structure.
- Baseline schema definitions for schedule, artists, and live wall.
- Next.js 16 + Tailwind CSS foundation.
