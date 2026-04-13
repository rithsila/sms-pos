# Shop Management System - Project Structure

## 1. Directory Structure

```
/mnt/okcomputer/output/
├── app/                          # React Application
│   ├── public/                   # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   └── ui/              # shadcn/ui components
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── checkbox.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── select.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sonner.tsx
│   │   │       ├── switch.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       └── ...
│   │   ├── data/                # Data stores & mock data
│   │   │   ├── store.ts         # Main app data (income, expense, products, staff)
│   │   │   └── attendanceStore.ts # Attendance-specific data
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── use-mobile.tsx
│   │   ├── lib/                 # Utility functions
│   │   │   └── utils.ts         # cn() helper for Tailwind
│   │   ├── sections/            # Page sections (main components)
│   │   │   ├── DashboardSection.tsx
│   │   │   ├── IncomeExpenseSection.tsx
│   │   │   ├── InventorySection.tsx
│   │   │   ├── StaffSection.tsx
│   │   │   ├── TelegramSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── AttendanceSection.tsx
│   │   │   ├── EnhancedAttendanceSection.tsx
│   │   │   └── ReportsSection.tsx
│   │   ├── types/               # TypeScript type definitions
│   │   │   ├── index.ts         # Main types
│   │   │   └── attendance.ts    # Attendance-specific types
│   │   ├── App.tsx              # Main app component
│   │   ├── index.css            # Global styles
│   │   └── main.tsx             # App entry point
│   ├── components.json          # shadcn/ui config
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── Design.md                     # UI/UX Design Document
├── PRD.md                        # Product Requirements Document
├── Structure.md                  # This file
├── TechStack.md                  # Technology stack documentation
├── API.md                        # API documentation (to be created)
├── Database.md                   # Database schema (to be created)
└── Deployment.md                 # Deployment guide (to be created)
```

## 2. Component Architecture

### 2.1 Component Hierarchy

```
App.tsx
├── Navigation Bar (Fixed)
│   ├── Logo
│   ├── Desktop Navigation
│   ├── Notifications
│   ├── User Menu (Dropdown)
│   └── Mobile Menu (Sheet)
│
└── Main Content (Dynamic Section)
    ├── DashboardSection
    │   ├── Stats Cards (4x Grid)
    │   ├── Revenue Chart
    │   ├── Quick Actions
    │   ├── Low Stock Alert
    │   ├── Recent Transactions
    │   └── Staff Overview
    │
    ├── IncomeExpenseSection
    │   ├── Summary Cards (3x)
    │   ├── Transaction List
    │   ├── Add Income Dialog
    │   ├── Add Expense Dialog
    │   └── Fixed Expenses Info
    │
    ├── InventorySection
    │   ├── Stats Cards (4x)
    │   ├── Low Stock Alert Banner
    │   ├── Search & Filter Bar
    │   ├── Product Grid/List
    │   ├── Add Product Dialog
    │   └── Edit Product Dialog
    │
    ├── StaffSection
    │   ├── Stats Cards (3x)
    │   ├── Search Bar
    │   ├── Staff Grid
    │   ├── Add Staff Dialog
    │   └── Staff Details Dialog
    │
    ├── EnhancedAttendanceSection
    │   ├── Tabs Navigation
    │   ├── KPI Cards (8x)
    │   ├── Dashboard Tab
    │   ├── Attendance Calendar Tab
    │   ├── Employees Tab (with bulk ops)
    │   ├── Positions Tab
    │   ├── Schedules Tab
    │   ├── Holidays Tab
    │   ├── Leaves Tab
    │   ├── QR Check-in Tab
    │   └── Multiple Dialogs
    │
    ├── TelegramSection
    │   ├── Connection Status Card
    │   ├── Configuration Panel
    │   └── Message History
    │
    ├── CategoriesSection
    │   ├── Category Grid
    │   ├── Add Category Dialog
    │   └── Edit Category Dialog
    │
    └── ReportsSection
        ├── KPI Cards (4x)
        ├── Financial Charts
        ├── Product Analytics
        ├── Staff Performance
        └── Export Options
```

## 3. State Management

### 3.1 Current State (Local State)
All state is currently managed locally using React's `useState` hook:

```typescript
// App.tsx - Global state
const [stats, setStats] = useState<DashboardStats>(initialDashboardStats);
const [incomes, setIncomes] = useState<Income[]>(sampleIncomes);
const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
const [products, setProducts] = useState<Product[]>(sampleProducts);
const [staff, setStaff] = useState<Staff[]>(sampleStaff);

// EnhancedAttendanceSection.tsx - Attendance state
const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
const [positions, setPositions] = useState<Position[]>(samplePositions);
const [schedules, setSchedules] = useState<AttendanceSchedule[]>(sampleSchedules);
const [holidays, setHolidays] = useState<Holiday[]>(sampleHolidays);
const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(sampleLeaveRequests);
```

### 3.2 Future State Management (Recommended)
For production, consider:
- **Redux Toolkit**: For complex global state
- **React Query/TanStack Query**: For server state management
- **Zustand**: Lightweight alternative to Redux
- **Context API**: For theme, auth, and user preferences

## 4. Data Flow

### 4.1 Current Data Flow
```
User Action → Local State Update → UI Re-render
                    ↓
              Data Store (Mock)
```

### 4.2 Future Data Flow (With Backend)
```
User Action → API Call → Backend → Database
                    ↓
              Response → State Update → UI Re-render
```

## 5. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `DashboardSection.tsx` |
| Hooks | camelCase with use prefix | `useMobile.tsx` |
| Types | PascalCase | `Employee`, `AttendanceRecord` |
| Utilities | camelCase | `utils.ts`, `formatCurrency.ts` |
| Styles | kebab-case | `index.css`, `globals.css` |
| Constants | UPPER_SNAKE_CASE | `SAMPLE_EMPLOYEES` |

## 6. Import Organization

Recommended import order:
```typescript
// 1. React & libraries
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Third-party components
import { Card, Button } from '@/components/ui';

// 3. Internal components
import { DashboardCard } from '@/components/DashboardCard';

// 4. Hooks
import { useAuth } from '@/hooks/useAuth';

// 5. Types
import type { Employee, AttendanceRecord } from '@/types';

// 6. Data/Utils
import { sampleEmployees } from '@/data/store';
import { formatCurrency } from '@/lib/utils';

// 7. Styles
import './styles.css';
```

## 7. Key Files Reference

### 7.1 Entry Points
| File | Purpose |
|------|---------|
| `main.tsx` | Application entry point |
| `App.tsx` | Root component with routing |
| `index.html` | HTML template |

### 7.2 Configuration Files
| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |
| `components.json` | shadcn/ui configuration |
| `package.json` | Dependencies and scripts |

### 7.3 Style Files
| File | Purpose |
|------|---------|
| `index.css` | Global styles, CSS variables, animations |
| `tailwind.config.js` | Tailwind customization |

## 8. Module Dependencies

```
App.tsx
├── sections/*
│   ├── components/ui/*
│   ├── types/*
│   └── data/*
│
├── components/ui/*
│   └── lib/utils.ts
│
├── hooks/*
│
├── types/*
│
└── data/*
```

## 9. Build Output

```
dist/
├── assets/
│   ├── index-xxx.js
│   ├── index-xxx.css
│   └── ...
├── index.html
└── vite.svg
```

## 10. Development Workflow

### 10.1 Local Development
```bash
cd /mnt/okcomputer/output/app
npm run dev
# Server runs on http://localhost:5173
```

### 10.2 Build for Production
```bash
cd /mnt/okcomputer/output/app
npm run build
# Output in dist/ folder
```

### 10.3 Deployment
```bash
# Deploy to production
# Copy dist/ folder to web server or use deployment tool
```
