# Shop Management System (SMS-POS)

A React web application for managing retail shop operations — income/expense tracking, inventory, staff, attendance with QR check-in, and Telegram payment notifications. Built for a retail shop in Cambodia (USD currency).

**Status:** Frontend MVP (mock data, no backend yet)

---

## Features

| Module | What it does | Status |
|--------|-------------|--------|
| **Dashboard** | KPI cards, revenue vs expense chart, break-even analysis, low stock alerts | Working |
| **Income/Expense** | Add transactions, category filtering, search | Working (no persistence) |
| **Inventory** | Product CRUD, grid/table views, stock level alerts | Working (no persistence) |
| **Staff** | Employee profiles, performance display | Working (display only) |
| **Attendance** | Calendar view, employee list, leave management, schedules, holidays | Working (mock data) |
| **Categories** | Product category management with color coding | Working (local state) |
| **Telegram** | ABA Payway payment notification display | Display only |
| **Reports** | Charts, KPI summary | Display only (export not wired) |

**Known limitations:**
- All data is local React state — lost on page refresh
- CSV/Excel/PDF export buttons exist but don't generate files
- QR code displayed but no camera scanning
- Staff performance percentages are hardcoded
- No authentication (roles are simulated)

---

## Quick Start

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

## Commands

All commands run from the `app/` directory:

```bash
npm run dev        # Start dev server
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test runner or backend is configured yet.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI library |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Build tool |
| Tailwind CSS | 3.4 | Styling (HSL design tokens) |
| shadcn/ui | Latest | UI components (New York style) |
| Recharts | 2 | Charts |
| Lucide React | Latest | Icons |
| date-fns | 4 | Date utilities |
| Sonner | 2 | Toast notifications |

---

## Architecture

Single-page app with **no router**. `App.tsx` holds all global state and switches views via a `SectionType` union:

```
App.tsx (state + navigation)
  -> sections/DashboardSection.tsx
  -> sections/IncomeExpenseSection.tsx
  -> sections/InventorySection.tsx
  -> sections/StaffSection.tsx
  -> sections/EnhancedAttendanceSection.tsx
  -> sections/CategoriesSection.tsx
  -> sections/TelegramSection.tsx
  -> sections/ReportsSection.tsx
```

**Path alias:** `@/` maps to `src/`

---

## Project Structure

```
app/src/
├── components/ui/    # shadcn/ui components
├── sections/         # Page-level views
├── data/             # Mock data stores
├── types/            # TypeScript definitions
├── hooks/            # Custom React hooks
├── lib/utils.ts      # cn() class merging utility
├── App.tsx           # Root component
└── index.css         # Design tokens, animations, custom classes
```

---

## Design Tokens

Colors use HSL CSS variables aligned with Tailwind:

| Token | Color | Tailwind class |
|-------|-------|---------------|
| `--primary` | Blue (#1a73e8) | `text-primary`, `bg-primary` |
| `--secondary` | Purple (#8e24aa) | `text-secondary`, `bg-secondary` |
| `--destructive` | Red (#ea4335) | `text-destructive`, `bg-destructive` |
| `--success` | Green (#34a853) | `text-success`, `bg-success` |
| `--warning` | Yellow (#fbbc04) | `text-warning`, `bg-warning` |
| `--foreground` | Dark (#202124) | `text-foreground` |
| `--muted-foreground` | Gray (#5f6368) | `text-muted-foreground` |

---

## Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](./CLAUDE.md) | AI coding agent instructions |
| [PRD.md](./PRD.md) | Product requirements and feature status |
| [TechStack.md](./TechStack.md) | Technology choices and planned database schema |
| [API.md](./API.md) | Planned REST API endpoints (not implemented) |
| [Database.md](./Database.md) | Planned database schema (not implemented) |
| [Structure.md](./Structure.md) | Detailed directory structure |
| [Deployment.md](./Deployment.md) | Deployment guide (for future backend) |
| [Security.md](./Security.md) | Security considerations |
| [Contributing.md](./Contributing.md) | Contribution guidelines |
| [Testing.md](./Testing.md) | Testing strategy (not implemented) |

---

## Business Context

- **Location:** Cambodia
- **Currency:** USD
- **Payment:** ABA Payway integration (planned)
- **Fixed monthly expenses:** $2,622 (rent $680, salaries $720, electricity $800, etc.)
- **Break-even at 30% margin:** $8,740/month in sales

---

## Roadmap

### Phase 1 — Frontend MVP (current)
- [x] Dashboard with analytics
- [x] Income/expense tracking UI
- [x] Inventory management UI
- [x] Staff management UI
- [x] Attendance system UI
- [x] Design token system (HSL + Tailwind)

### Phase 2 — Backend Integration (planned)
- [ ] Node.js + Express + TypeScript backend
- [ ] PostgreSQL database with Prisma ORM
- [ ] JWT authentication
- [ ] REST API for all modules
- [ ] Data persistence

### Phase 3 — Advanced Features (future)
- [ ] Real-time WebSocket attendance
- [ ] CSV/Excel/PDF export
- [ ] QR camera scanning
- [ ] Multi-shop support
- [ ] Mobile app

---

## License

MIT
