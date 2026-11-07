# DDACC Architecture & System Memory

## Architectural Traits
- **Framework**: Next.js 16 (App Router) with React 19, TypeScript, and Tailwind CSS.
- **Single Source of Version Truth**: `VERSION.md` (currently `0.2.0`). Referenced across build outputs and documentation.
- **Consolidated Unified Page Design**: All primary operational and user-facing workflows (`Vision`, `Tracks`, `Schedule`, `Artist Alley Intake`, `Collaborative Digital Wall`) live on `/` via structured jump sections and cohesive visual hierarchy.
- **System Tray Operations**: Persistent bottom-right dock (`src/components/SystemTrayDock.tsx`) provides real-time system monitoring, server health telemetry, uptime counter, connection count, and server action controls (restart, cache flush, export CSV, test shutdown).
- **Backend API Endpoints**:
  - `GET /api/schedule`: Provides searchable, filterable schedule session payloads.
  - `GET /api/schedule/export`: Dynamic RFC 5545 `.ics` iCalendar generator for Apple/Google/Outlook syncing.
  - `GET /api/applications`, `POST /api/applications`: Processes speaker and artist alley proposals protected by rate limiting.
  - `GET /api/applications/export`: Generates downloadable CSV containing intake applications.
  - `GET /api/wall`, `POST /api/wall`: In-memory and persisted community shoutout and collaboration wall protected by rate limiting.
  - `GET /api/system/status`: Server health check and diagnostics.
- **Security & Rate Limiting**: `src/lib/rateLimit.ts` handles per-IP client token-bucket rate limiting for public submission endpoints to prevent flooding.
- **Universal Tooltips**: Tooltips built using accessible SVG triggers with aria labels and keyboard-accessible hover/focus states (`src/components/Tooltip.tsx`).

## Design Preferences
- Dark-mode primary with vibrant cyan/purple neon accents reflecting Detroit electronic music and industrial neon aesthetic.
- Glassmorphism surfaces (`backdrop-blur-md`, subtle border highlights `border-white/10`).
- No external heavy UI libraries required; all components crafted natively with Tailwind CSS and React state.
