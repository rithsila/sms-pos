# Shop Management Web App - Project Context

## Project Overview

A comprehensive **React-based web application** for managing retail shop operations. This is currently a **frontend-only MVP** with mock data, designed for a retail shop in Cambodia using USD currency.

**Key Features:**
- Dashboard with KPIs, charts, and break-even analysis
- Income/Expense tracking with categories
- Inventory management with low-stock alerts
- Staff management with performance tracking
- Attendance system with QR code check-in
- Telegram bot integration for ABA Payway payments
- Reports with export functionality (Excel, CSV, PDF)

**Live Demo:** https://dos63vzh5wevu.ok.kimi.link

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 3 + shadcn/ui components |
| **UI Primitives** | Radix UI |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Date Handling** | date-fns |
| **Forms** | React Hook Form + Zod validation |
| **Notifications** | Sonner (toast) |
| **Animations** | GSAP |

---

## Project Structure

```
Shop Management Web App/
├── app/                          # Frontend React application
│   ├── src/
│   │   ├── components/ui/        # shadcn/ui reusable components
│   │   ├── sections/             # Main page sections
│   │   │   ├── DashboardSection.tsx
│   │   │   ├── IncomeExpenseSection.tsx
│   │   │   ├── InventorySection.tsx
│   │   │   ├── StaffSection.tsx
│   │   │   ├── EnhancedAttendanceSection.tsx
│   │   │   ├── TelegramSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   └── ReportsSection.tsx
│   │   ├── data/                 # Mock data stores
│   │   │   ├── store.ts          # Main app data
│   │   │   └── attendanceStore.ts
│   │   ├── types/                # TypeScript definitions
│   │   │   ├── index.ts          # Core types
│   │   │   └── attendance.ts     # Attendance-specific types
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities
│   │   │   └── utils.ts          # cn() helper
│   │   ├── App.tsx               # Main component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── public/
│   ├── dist/                     # Build output
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── components.json           # shadcn/ui config
│
├── README.md                     # Main documentation
├── PRD.md                        # Product Requirements
├── Structure.md                  # Project structure guide
├── TechStack.md                  # Technology documentation
├── API.md                        # REST API specs (future backend)
├── Database.md                   # PostgreSQL schema design
├── Deployment.md                 # Production deployment guide
├── Testing.md                    # Testing strategy
├── Security.md                   # Security guidelines
└── Contributing.md               # Contribution guidelines
```

---

## Development Commands

All commands are run from the `app/` directory:

```bash
cd app

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `app/vite.config.ts` | Vite build config with path alias `@/` → `src/` |
| `app/tailwind.config.js` | Tailwind CSS customization |
| `app/tsconfig.json` | TypeScript compiler options |
| `app/components.json` | shadcn/ui component configuration |
| `app/package.json` | Dependencies and scripts |

---

## State Management

**Current:** Local React state with `useState` hooks in `App.tsx`

Data flows from mock data stores:
- `src/data/store.ts` - incomes, expenses, products, staff
- `src/data/attendanceStore.ts` - attendance-specific data

**Future (Planned):** Backend API integration with PostgreSQL database

---

## Type Definitions

Core types are defined in `src/types/index.ts`:

```typescript
interface Income { id, date, amount, category, description, createdAt }
interface Expense { id, date, amount, category, description, createdAt }
interface Product { id, name, sku, category, price, stock, minStock, image?, createdAt }
interface Staff { id, name, role, email, phone, avatar?, performance, salesThisMonth, attendance, joinedDate }
interface Attendance { id, staffId, date, status, checkIn?, checkOut?, hoursWorked?, notes? }
interface ProductCategory { id, name, icon, color, productCount }
interface DashboardStats { totalRevenue, totalExpenses, netProfit, pendingOrders, lowStockProducts, ... }
```

---

## UI Components (shadcn/ui)

Available components in `src/components/ui/`:

- Avatar, Badge, Button, Card, Checkbox
- Dialog, Dropdown Menu, Input, Label
- Select, Sheet (drawer), Sonner (toast)
- Switch, Table, Tabs, Tooltip
- And more Radix UI-based components

---

## Navigation Structure

The app uses a single-page layout with section switching:

| Section | Component | Route ID |
|---------|-----------|----------|
| Dashboard | `DashboardSection` | `dashboard` |
| Income/Expense | `IncomeExpenseSection` | `income-expense` |
| Inventory | `InventorySection` | `inventory` |
| Categories | `CategoriesSection` | `categories` |
| Staff | `StaffSection` | `staff` |
| Attendance | `EnhancedAttendanceSection` | `attendance` |
| Telegram Bot | `TelegramSection` | `telegram` |
| Reports | `ReportsSection` | `reports` |

---

## Key Business Logic

### Fixed Monthly Expenses (User's Data)
| Expense | Amount (USD) |
|---------|--------------|
| Rental fee | $680 |
| Staff salary (4 people) | $720 |
| Electricity bill | $800 |
| Franchise management fee | $117 |
| Other expenses | $200 |
| Garbage fee | $30 |
| Internet fee | $15 |
| Staff benefits | $60 |
| **Total Fixed** | **$2,622/month** |

### Break-even Analysis
- At 40% profit margin: Need **$6,555/month** in sales
- At 30% profit margin: Need **$8,740/month** in sales
- Average order value: **$2.50**

---

## Future Backend Integration

The project is designed for future backend integration:

**Recommended Stack:**
- Node.js + Express + TypeScript
- PostgreSQL database (schema in `Database.md`)
- JWT authentication
- Prisma ORM
- Socket.io for real-time attendance

**API Base URL:** `http://localhost:3000/api/v1` (future)

---

## Coding Conventions

### Import Organization
```typescript
// 1. React & libraries
import { useState } from 'react';

// 2. Third-party components
import { Card, Button } from '@/components/ui';

// 3. Internal components
import { DashboardCard } from '@/components/DashboardCard';

// 4. Types
import type { Product } from '@/types';

// 5. Data/Utils
import { sampleProducts } from '@/data/store';
```

### Naming Conventions
- Components: PascalCase (`DashboardSection.tsx`)
- Hooks: camelCase with `use` prefix (`useMobile.tsx`)
- Types: PascalCase (`Employee`, `AttendanceRecord`)
- Utilities: camelCase (`utils.ts`)

### TypeScript
- Explicit type annotations preferred
- Interfaces for component props
- Type safety enforced via tsconfig

---

## Testing

**Current:** No tests implemented (MVP phase)

**Planned Stack:**
- Unit: Jest + React Testing Library
- E2E: Cypress
- Coverage target: 70%

---

## Deployment

**Current:** Static hosting via Kimi Deploy

**Production Options:**
1. **VPS** (Ubuntu + Nginx + PM2)
2. **Docker** (docker-compose with PostgreSQL)
3. **Cloud** (AWS EC2, GCP, Heroku, Vercel)

See `Deployment.md` for detailed guides.

---

## Documentation Files

| Document | Description |
|----------|-------------|
| `README.md` | Main project overview and quick start |
| `PRD.md` | Product requirements, user stories, roadmap |
| `Structure.md` | Detailed project structure and architecture |
| `TechStack.md` | Technology choices and database schema |
| `API.md` | REST API specification (for future backend) |
| `Database.md` | PostgreSQL schema with seed data |
| `Deployment.md` | Production deployment guide |
| `Testing.md` | Testing strategy and examples |
| `Security.md` | Security policies and best practices |
| `Contributing.md` | Contribution guidelines and code standards |

---

## Common Tasks

### Add a New Section
1. Create component in `src/sections/`
2. Add navigation item in `App.tsx`
3. Add route handling in switch statement
4. Update types if needed

### Add a New UI Component
1. Use shadcn/ui CLI: `npx shadcn-ui@latest add component-name`
2. Or manually create in `src/components/ui/`
3. Export from components index if needed

### Update Mock Data
1. Modify data in `src/data/store.ts`
2. Update types in `src/types/index.ts` if structure changes

### Build for Production
```bash
cd app
npm run build
# Output in dist/
```

---

## Known Limitations (MVP)

- No real authentication (simulated roles)
- No persistent data (resets on refresh)
- No backend API integration
- No file upload functionality
- No real-time WebSocket updates

---

## Contact & Support

- **Documentation:** See markdown files in root directory
- **Issues:** Track via GitHub (future)
- **Tech Stack Details:** See `TechStack.md`
- **API Specs:** See `API.md`
