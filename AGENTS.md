# Shop Management System - Agent Guide

This document provides essential information for AI coding agents working on the Shop Management System project.

---

## Project Overview

The Shop Management System is a comprehensive React-based web application for managing retail shop operations. It is currently a **frontend-only MVP** with mock data, designed for a retail shop in Cambodia using USD currency.

**Live Demo:** https://dos63vzh5wevu.ok.kimi.link

### Core Features
- **Dashboard** - KPI cards, revenue charts, break-even analysis, low stock alerts
- **Income/Expense Tracking** - Transaction management with categories
- **Inventory Management** - Product CRUD, stock alerts, category filtering
- **Staff Management** - Employee profiles, performance tracking
- **Attendance System** - QR code check-in, schedules, leave requests, holidays
- **Telegram Integration** - ABA Payway payment notifications
- **Reports & Analytics** - Financial reports with export to Excel/CSV/PDF

### Key Business Data
- **Fixed Monthly Expenses:** $2,622 (rent, salaries, utilities, etc.)
- **Break-even at 30% margin:** $8,740/month in sales
- **Currency:** USD
- **Location:** Cambodia (ABA Payway integration)

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI library |
| TypeScript | 5.9.x | Type safety |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 3.4.x | Utility-first CSS |
| shadcn/ui | Latest | UI component library |
| Radix UI | Latest | Headless UI primitives |
| Lucide React | Latest | Icon library |
| Recharts | 2.x | Data visualization |
| date-fns | 4.x | Date manipulation |
| React Hook Form | 7.x | Form handling |
| Zod | 4.x | Schema validation |
| Sonner | 2.x | Toast notifications |
| GSAP | 3.x | Animations |

### Future Backend (Planned)
- Node.js + Express + TypeScript
- PostgreSQL 15+
- Prisma ORM
- JWT authentication
- Socket.io for real-time updates

---

## Project Structure

```
Shop Management Web App/
├── app/                          # Frontend React application
│   ├── src/
│   │   ├── components/ui/        # shadcn/ui reusable components (50+ components)
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
│   │   │   ├── store.ts          # Main app data (incomes, expenses, products, staff)
│   │   │   └── attendanceStore.ts
│   │   ├── types/                # TypeScript definitions
│   │   │   ├── index.ts          # Core types
│   │   │   └── attendance.ts     # Attendance-specific types
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── use-mobile.ts
│   │   ├── lib/                  # Utilities
│   │   │   └── utils.ts          # cn() helper for Tailwind
│   │   ├── App.tsx               # Main component with navigation
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   ├── dist/                     # Build output
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── eslint.config.js          # ESLint configuration
│   └── components.json           # shadcn/ui configuration
│
├── README.md                     # Main documentation
├── PRD.md                        # Product Requirements Document
├── Structure.md                  # Project structure guide
├── TechStack.md                  # Technology documentation
├── API.md                        # REST API specifications
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

### Vite Config (`app/vite.config.ts`)
- Path alias: `@/` maps to `src/`
- Base URL: `./` (relative paths for deployment)
- React plugin included

### TypeScript Config (`app/tsconfig.json`)
- Path mapping: `@/*` → `./src/*`
- References: `tsconfig.app.json`, `tsconfig.node.json`

### Tailwind Config (`app/tailwind.config.js`)
- Dark mode: `class`
- Content: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- Custom colors using CSS variables (HSL format)
- Animations: accordion, caret-blink
- Plugin: `tailwindcss-animate`

### ESLint Config (`app/eslint.config.js`)
- Files: `**/*.{ts,tsx}`
- Extends: `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`
- Ignores: `dist/` directory

---

## State Management

**Current:** Local React state with `useState` hooks in `App.tsx`

Data flows from mock data stores:
- `src/data/store.ts` - incomes, expenses, products, staff
- `src/data/attendanceStore.ts` - attendance-specific data (employees, positions, schedules, holidays, leave requests)

**Key State Variables in App.tsx:**
```typescript
const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
const [stats, setStats] = useState<DashboardStats>(initialDashboardStats);
const [incomes, setIncomes] = useState<Income[]>(sampleIncomes);
const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
const [products, setProducts] = useState<Product[]>(sampleProducts);
const [staff, setStaff] = useState<Staff[]>(sampleStaff);
```

**Future:** Backend API integration with PostgreSQL database

---

## Type Definitions

Core types are defined in `src/types/index.ts`:

```typescript
interface Income {
  id: string;
  date: string;
  amount: number;
  category: 'Sales' | 'Service' | 'Other';
  description: string;
  createdAt: string;
}

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: 'Rent' | 'Utilities' | 'Inventory' | 'Salary' | 'Other';
  description: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  image?: string;
  createdAt: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  performance: number;
  salesThisMonth: number;
  attendance: number;
  joinedDate: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalProducts: number;
  activeStaff: number;
  totalStaff: number;
}
```

Additional attendance types in `src/types/attendance.ts`:
- `Employee`, `Position`, `AttendanceSchedule`
- `Holiday`, `LeaveRequest`, `AttendanceRecord`
- `QRCodeData`, `CheckInStats`

---

## UI Components (shadcn/ui)

Available components in `src/components/ui/` (50+ components):

**Layout:** Accordion, Aspect Ratio, Card, Collapsible, Resizable, Scroll Area, Separator, Sheet, Sidebar, Skeleton, Tabs

**Forms:** Button, Checkbox, Command, Dialog, Dropdown Menu, Field, Form, Hover Card, Input, Input Group, Input OTP, Label, Menubar, Navigation Menu, Pagination, Popover, Radio Group, Select, Slider, Switch, Table, Textarea, Toggle, Toggle Group

**Feedback:** Alert, Alert Dialog, Badge, Calendar, Carousel, Chart, Progress, Sonner (toast), Spinner, Tooltip

**Data Display:** Avatar, Breadcrumb, Command, Context Menu, Kbd

---

## Code Style Guidelines

### Import Organization
```typescript
// 1. React & libraries
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Third-party components
import { Card, Button } from '@/components/ui';

// 3. Internal components
import { DashboardSection } from '@/sections/DashboardSection';

// 4. Hooks
import { useMobile } from '@/hooks/useMobile';

// 5. Types
import type { Product, Staff } from '@/types';

// 6. Data/Utils
import { sampleProducts } from '@/data/store';
import { cn } from '@/lib/utils';

// 7. Styles
import './styles.css';
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `DashboardSection.tsx` |
| Hooks | camelCase with `use` prefix | `useMobile.tsx` |
| Types | PascalCase | `Employee`, `AttendanceRecord` |
| Utilities | camelCase | `utils.ts`, `formatCurrency.ts` |
| Styles | kebab-case | `index.css`, `globals.css` |
| Constants | UPPER_SNAKE_CASE | `SAMPLE_EMPLOYEES` |

### TypeScript Standards
- Explicit type annotations preferred
- Interfaces for component props
- Type safety enforced via tsconfig
- Use type imports: `import type { Foo } from './types'`

### Component Structure
```typescript
// Props interface
interface KPICardProps {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
}

// Functional component
export function KPICard({ title, value, trend }: KPICardProps) {
  return (
    <div className="kpi-card">
      {/* JSX */}
    </div>
  );
}
```

### Tailwind CSS Conventions
```typescript
// ✅ Good - Organized Tailwind classes
function Button({ variant, children }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}

// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

className={cn(
  'px-4 py-2 rounded-lg',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800'
)}
```

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

Navigation is handled in `App.tsx` via `activeSection` state.

---

## Testing Strategy

**Current Status:** No tests implemented (MVP phase)

**Planned Stack:**
- Unit Testing: Jest + React Testing Library
- E2E Testing: Cypress
- API Testing: Supertest
- Coverage Target: 70%

**Test File Locations:**
- Components: `src/components/__tests__/ComponentName.test.tsx`
- Sections: `src/sections/__tests__/SectionName.test.tsx`
- Hooks: `src/hooks/__tests__/useHookName.test.ts`
- Utils: `src/lib/__tests__/utilName.test.ts`

See `Testing.md` for detailed testing documentation and examples.

---

## Security Considerations

### Current MVP Limitations
- No real authentication (simulated roles)
- No persistent data (resets on refresh)
- No backend API integration

### Planned Security Implementation
- JWT-based authentication with short-lived access tokens (15m) and refresh tokens (7d)
- Role-based access control (RBAC) with permissions matrix
- Password hashing with bcrypt (12 rounds)
- Rate limiting: 100 requests per 15 minutes (general), 5 attempts per 15 minutes (auth)
- CORS configuration with allowed origins whitelist
- Security headers via Helmet middleware
- Input validation with Zod schemas
- SQL injection prevention via parameterized queries (Prisma)
- XSS protection via input sanitization (DOMPurify)
- File upload security with MIME type validation and size limits (10MB)
- Audit logging for all data changes

### Security Checklist for Production
- [ ] Change default passwords
- [ ] Enable firewall (UFW)
- [ ] Configure fail2ban
- [ ] Enable automatic security updates
- [ ] Use strong JWT secrets (min 32 chars)
- [ ] Enable HTTPS only with HSTS
- [ ] Set secure HTTP headers
- [ ] Regular backups
- [ ] Monitor logs

See `Security.md` for comprehensive security documentation.

---

## Deployment

### Current Deployment
- **Platform:** Kimi Deploy (static hosting)
- **Output:** `app/dist/` directory

### Production Deployment Options

#### 1. VPS (Ubuntu + Nginx + PM2)
- Server: Ubuntu 22.04 LTS
- Node.js: 20.x
- Database: PostgreSQL 15
- Process Manager: PM2
- Reverse Proxy: Nginx
- SSL: Let's Encrypt

#### 2. Docker Deployment
```bash
docker-compose up -d
```
- Services: app (Node.js), db (PostgreSQL), nginx, certbot
- Volumes: postgres_data, uploads, certbot

#### 3. Cloud Platforms
- AWS: EC2 + RDS + S3 + CloudFront
- Google Cloud: Compute Engine + Cloud SQL
- Heroku: Platform as a Service
- Vercel: Frontend hosting

See `Deployment.md` for detailed deployment guides.

---

## Database Schema (Future)

PostgreSQL schema is defined in `Database.md` with the following tables:

**Core Tables:**
- `users` - System user accounts
- `categories` - Transaction and product categories
- `products` - Inventory items
- `stock_history` - Stock movement audit trail
- `transactions` - Income and expense records

**Staff Tables:**
- `positions` - Job positions
- `staff` - Employee information
- `attendance` - Daily attendance records
- `schedules` - Work schedules
- `holidays` - Company and public holidays
- `leave_requests` - Employee leave requests

**Integration Tables:**
- `telegram_payments` - Payment notifications
- `settings` - System configuration
- `audit_logs` - Change audit trail

See `Database.md` for complete SQL schema with indexes, triggers, and seed data.

---

## API Specification (Future)

REST API endpoints are documented in `API.md`:

**Base URL:** `http://localhost:3000/api/v1`

**Authentication:** Bearer token in Authorization header

**Endpoints:**
- `/auth/login`, `/auth/refresh`, `/auth/logout`
- `/dashboard/stats`, `/dashboard/charts`
- `/transactions`, `/transactions/categories`
- `/inventory/products`, `/inventory/categories`
- `/staff`, `/staff/:id/performance`
- `/attendance/records`, `/attendance/check-in`, `/attendance/qr-code`
- `/employees`, `/positions`, `/schedules`, `/holidays`, `/leaves`

All responses follow a consistent format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## Common Development Tasks

### Add a New Section
1. Create component in `src/sections/NewSection.tsx`
2. Add to navigation items in `App.tsx`
3. Add route case in `renderSection()` switch statement
4. Update `SectionType` type if needed
5. Create mock data in `src/data/store.ts` if needed

### Add a New UI Component
```bash
# Using shadcn/ui CLI
npx shadcn-ui@latest add component-name

# Or manually create in src/components/ui/
# Follow existing component patterns
```

### Update Mock Data
1. Modify data in `src/data/store.ts` or `src/data/attendanceStore.ts`
2. Update types in `src/types/index.ts` if structure changes
3. Update initial values in `App.tsx` if needed

### Add a New Type
1. Add interface/type to `src/types/index.ts` or `src/types/attendance.ts`
2. Export from index if adding to attendance.ts
3. Update mock data to include new type

### Handle Form Submission
```typescript
// Use React Hook Form with Zod validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive(),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = (data: FormData) => {
    // Handle submission
    toast.success('Success!');
  };
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

---

## Known Limitations (MVP)

- No real authentication (simulated roles)
- No persistent data (resets on page refresh)
- No backend API integration
- No file upload functionality
- No real-time WebSocket updates
- No multi-language support
- No mobile app

---

## Documentation Reference

| Document | Description |
|----------|-------------|
| `README.md` | Main project overview and quick start |
| `PRD.md` | Product requirements, user stories, roadmap |
| `Structure.md` | Detailed project structure and architecture |
| `TechStack.md` | Technology choices and comparisons |
| `API.md` | Complete REST API specification |
| `Database.md` | PostgreSQL schema with relationships |
| `Deployment.md` | Production deployment guides |
| `Testing.md` | Testing strategy and examples |
| `Security.md` | Security policies and best practices |
| `Contributing.md` | Contribution guidelines and code standards |

---

## Useful Commands Reference

```bash
# Development
cd app && npm run dev              # Start dev server
cd app && npm run build            # Build for production
cd app && npm run preview          # Preview production build
cd app && npm run lint             # Run ESLint

# Future backend commands
cd server && npm run dev           # Start backend dev server
cd server && npm run migrate       # Run database migrations
cd server && npm run seed          # Seed database

# Testing (planned)
npm test                           # Run all tests
npm run test:watch                 # Run tests in watch mode
npm run cypress:run                # Run E2E tests

# Docker deployment (planned)
docker-compose up -d               # Start all services
docker-compose logs -f app         # View app logs
docker-compose down                # Stop all services
```

---

## Contact & Support

- **Documentation:** See markdown files in project root
- **Tech Stack Details:** See `TechStack.md`
- **API Specs:** See `API.md`
- **Database Schema:** See `Database.md`

---

*Last updated: 2026-03-23*
*Version: 1.0.0*
