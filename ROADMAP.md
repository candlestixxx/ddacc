# DDACC Strategic Roadmap

## Milestone 1: Unified Core Experience & Platform Guardrails (Completed - v0.2.0)
- [x] Unified single-page dashboard organizing all convention pillars.
- [x] Floating persistent System Tray Dock with server telemetry and controls.
- [x] Tooltip guidance system for all complex parameters and technical requirements.
- [x] Fully wired Next.js Route Handlers (`/api/schedule`, `/api/applications`, `/api/wall`, `/api/system/status`).
- [x] Sliding-window rate limiting middleware protection (`src/lib/rateLimit.ts`) on public intake and wall POST routes.
- [x] Interactive schedule filtering, bookmarks, and modal session preview.
- [x] Dynamic Artist Alley submission form with pledge verification.
- [x] Live Collaborative Digital Wall with category filtering and real-time like increments.

## Milestone 2: Real-time Multi-User & Physical Integration (In Progress - v0.2.1 / v0.3.0)
- [x] Digital Badge Pass Generator with deterministic signature verification and simulated turnstile QR check-in (`src/lib/badge.ts`, `/api/badge/verify`, `BadgePassModal.tsx`).
- [ ] WebSocket gateway for millisecond-latency Digital Wall updates across Huntington Place display walls.
- [ ] Offline caching & Service Worker for intermittent mobile connectivity on convention floor.
- [ ] Live venue map integration (Huntington Place Hall C & Grand Ballroom overlay).

## Milestone 3: Community & Governance Expansion (v0.4.0)
- [ ] Community voting and peer review mechanism for Artist Alley jurying.
- [ ] Multi-lingual accessibility (English, Spanish, Arabic, ASL stream schedules).
- [ ] Archival streaming pipeline integration (PeerTube / open streaming relays).
