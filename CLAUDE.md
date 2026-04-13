# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shop Management System — a React SPA for a retail shop in Cambodia (USD currency). Manages income/expense tracking, inventory, staff, attendance (QR check-in), Telegram payment notifications (ABA Payway), and reports. Currently **frontend-only with mock data** (no backend).

**Fixed monthly expenses:** $2,622 | **Break-even at 30% margin:** $8,740/month

## Commands

All commands run from the `app/` directory:

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # TypeScript check + Vite build → dist/
npm run lint       # ESLint (TypeScript + React hooks rules)
npm run preview    # Preview production build
```

No test runner is configured yet.

## Architecture

### Tech Stack

- **Vite 7** + **React 19** + **TypeScript 5.9**
- **Tailwind CSS 3.4** + **shadcn/ui** (New York style, slate base)
- **Recharts** for charts, **Lucide React** for icons, **date-fns** for dates
- **React Hook Form** + **Zod** for form handling/validation
- **GSAP** for advanced animations, **Sonner** for toast notifications
- **Path alias:** `@/` → `src/` (configured in vite.config.ts and tsconfig.json)

### Navigation Pattern

Single-page app with **no router**. `App.tsx` is the root — it holds all global state and switches views via a `SectionType` union and `renderSection()` switch:

```
SectionType = 'dashboard' | 'income-expense' | 'inventory' | 'staff'
            | 'telegram' | 'categories' | 'attendance' | 'reports'
```

Each section component lives in `src/sections/` and receives data + handlers as props from App.tsx.

### State Management

All state lives in `App.tsx` via `useState`. Handlers (add/update/delete) are defined there and passed down as props. Stats are derived via `useEffect` when data changes.

### Key Directories

```
app/src/
├── components/ui/    # shadcn/ui components (auto-generated, don't edit manually)
├── sections/         # Page-level views (DashboardSection, InventorySection, etc.)
├── data/             # Mock data (store.ts, attendanceStore.ts)
├── types/            # TypeScript definitions (index.ts, attendance.ts)
├── hooks/            # Custom React hooks
└── lib/utils.ts      # cn() — Tailwind class merging utility
```

### Mock Data

`data/store.ts` exports `sampleIncomes`, `sampleExpenses`, `sampleProducts`, `sampleStaff`, `initialDashboardStats`, and `fixedMonthlyExpenses`. `data/attendanceStore.ts` has attendance-specific sample data.

## Styling

- **CSS variables** in `index.css` — Google-style palette (primary: `#1a73e8`)
- **Custom animations** in CSS: `fadeIn`, `fadeInUp`, `scaleIn`, etc.
- **Glass morphism**: `.glass` class, `.gradient-text` for brand gradient
- **Custom properties**: `--ease-spring`, `--shadow-primary`
- Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally

## Adding a New Section

1. Define types in `types/index.ts` or `types/attendance.ts`
2. Add mock data to appropriate `data/` file
3. Create `sections/NewSection.tsx`
4. Add to `SectionType` union, `navigationItems` array, and `renderSection()` switch in `App.tsx`
5. Use existing shadcn components or add new ones: `npx shadcn add <component>`

## Documentation

- `PRD.md` — Product requirements and feature status
- `AGENTS.md` — Detailed agent guide with full tech stack and business context
- `TechStack.md` — Technology choices and planned database schema
- `API.md` — Planned API endpoints (future backend)
- `Structure.md` — Detailed directory structure
- `Database.md` — Database design
- `Security.md` — Security considerations
- `Deployment.md` — Deployment guide

## Development Notes

- No authentication (simulated roles in UI)
- No backend API — all data is local React state
- `next-themes` is installed but theme switching is not yet wired up
- Adding shadcn components: `npx shadcn add <component>` (uses `components.json` config)
