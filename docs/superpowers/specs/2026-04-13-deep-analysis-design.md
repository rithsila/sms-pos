# Shop Management Web App - Deep Analysis & Fix Spec

**Date:** 2026-04-13
**Status:** Complete (Phases 1-5 done)

## Context

The Shop Management Web App is a React SPA for a Cambodian retail shop. A deep analysis found 200+ hardcoded colors, broken Tailwind-CSS token alignment, unused dependencies, type conflicts, UI inconsistencies, PRD gaps, and accessibility issues. This spec documents all findings and the fix plan.

## Approach: Fix Layer by Layer (Bottom-Up)

| Phase | What | Status |
|-------|------|--------|
| 1 | Config & cleanup | DONE |
| 2 | Design tokens & color system | DONE |
| 3 | Type unification | DONE |
| 4 | UI consistency | DONE |
| 5 | PRD gap fixes | DONE |

---

## Phase 1: Config & Cleanup (DONE)

### Changes Made
- **Tailwind-CSS variable mismatch fixed** - `:root` converted from hex to HSL format. Added 20+ missing variables (--foreground, --input, --ring, --muted, --accent, --popover, --card, --sidebar-*, --radius).
- **App-specific tokens preserved** - Renamed to `--color-*` prefix to avoid clashing with Tailwind HSL tokens.
- **Removed 6 unused deps** - gsap, zod, @hookform/resolvers, react-hook-form (form.tsx), kimi-plugin-inspect-react, tw-animate-css. ~98KB saved.
- **Deleted App.css** - Unused Vite boilerplate.
- **Removed 60+ duplicate utility classes** - .flex, .p-4, .rounded-lg, etc. that conflicted with Tailwind.
- **prefers-reduced-motion** - Already existed, verified complete.

### Files Modified
- `app/src/index.css` - HSL tokens, removed duplicates
- `app/package.json` - Removed deps
- `app/src/App.css` - Deleted
- `app/src/components/ui/form.tsx` - Deleted (unused)

---

## Phase 2: Design Tokens & Color System (DONE)

### Changes Made
- **Added success/warning tokens** to `tailwind.config.js` and `index.css` (HSL format).
- **Replaced 647 hardcoded hex colors** across all TSX files with semantic Tailwind classes.
- **Added light tint CSS variables** for runtime style props (--color-success-light, --color-destructive-light, etc.).
- **Recharts colors** converted to `hsl(var(--*))` references.
- **JS color objects** converted to CSS variable references.

### Color Mapping
| Hex | Tailwind Token | Usage |
|-----|---------------|-------|
| #1a73e8 | primary | Buttons, links, active states |
| #8e24aa | secondary | Gradients, accents |
| #ea4335 | destructive | Errors, delete, danger |
| #34a853 | success | In stock, income, positive |
| #fbbc04 | warning | Low stock, late, caution |
| #202124 | foreground | Main text |
| #5f6368 | muted-foreground | Secondary text |
| #dadce0 | border | Borders, dividers |
| #f5f5f5 | background | Page background |

### Files Modified
- `app/tailwind.config.js` - Added success/warning colors
- `app/src/index.css` - Added HSL tokens, light tint vars
- All 9 section TSX files - Color replacements
- `app/src/App.tsx` - Color replacements

---

## Phase 3: Type Unification (DONE)

### Problems Found
1. **Duplicate Attendance types** - `Attendance` in types/index.ts vs `AttendanceRecord` in types/attendance.ts model the same concept differently.
2. **Duplicate AttendanceSection** - Both AttendanceSection.tsx (350 lines, old) and EnhancedAttendanceSection.tsx (1834 lines, current) exist.
3. **Inconsistent role typing** - `Staff.role` is `string` but `Employee.role` uses `UserRole` literal union.
4. **Loose category types** - `Product.category` is `string`, `Income.category` has only 3 options, `Expense.category` has only 5.
5. **Loose `any` typing** - `BulkOperation.data` in attendance.ts typed as `Record<string, any>`.

### Changes Made
- **Deleted old `AttendanceSection.tsx`** - Consolidated on `EnhancedAttendanceSection.tsx` as the single source of truth.
- **Removed simple `Attendance` interface** from `types/index.ts`; unified on `AttendanceRecord` from `types/attendance.ts`.
- **Cleaned `store.ts`** - Removed `Attendance` import and `sampleAttendance` export (no consumers).
- **Added literal unions** to `types/index.ts`:
  - `ProductCategoryName = 'Electronics' | 'Clothing' | 'Food & Beverage' | 'Home & Garden' | 'Sports' | 'Others'`
  - `StaffRole = 'Manager' | 'Sales Associate' | 'Cashier' | 'Stock Keeper'`
- **Tightened `Product.category`** to `ProductCategoryName`; cast form inputs in `InventorySection.tsx` add/edit handlers.
- **Tightened `Staff.role`** to `StaffRole` union in type definition (form input left as free text — role rarely changes, UX decision).
- **Replaced `any` with `unknown`** in `BulkOperation.data` for safer typing (zero active consumers).

### Files Modified
- `app/src/types/index.ts` - Removed `Attendance`, added `ProductCategoryName` and `StaffRole` unions
- `app/src/types/attendance.ts` - `BulkOperation.data: any` → `unknown`
- `app/src/data/store.ts` - Removed `Attendance` import and `sampleAttendance` export
- `app/src/sections/InventorySection.tsx` - Added `ProductCategoryName` import and casts
- `app/src/sections/AttendanceSection.tsx` - Deleted (duplicate of enhanced version)

### Verification
- `npm run build` passes with zero TypeScript errors
- Committed: `16d15ea refactor: unify types and remove duplicate attendance code`

---

## Phase 4: UI Consistency (DONE)

### Problems Addressed
1. ~~**No loading/skeleton states**~~ — Reusable `ListSkeleton` and `StatsSkeleton` components created in `components/common/SectionSkeleton.tsx` (backed by existing shadcn `Skeleton`).
2. ~~**No error states**~~ — `ErrorState` component created in `components/common/ErrorState.tsx` with optional retry callback.
3. ~~**Inconsistent empty states**~~ — `EmptyState` component created in `components/common/EmptyState.tsx` with `default` and `search` variants.
4. ~~**Broken mobile interactions**~~ — All 3 `opacity-0 group-hover:opacity-100` buttons replaced with the dimmed-on-desktop pattern: `opacity-100 md:opacity-40 md:group-hover:opacity-100`. `aria-label` added.
5. ~~**Missing accessibility**~~ — Skip-to-content link added to `App.tsx`, `<main>` tagged with `id="main-content" tabIndex={-1}`. ARIA labels added to icon-only buttons touched in this phase.
6. **Inconsistent button styles** — Noted but not standardized in this pass (defer to future polish — current styles work and changing them is high-risk).
7. **Inconsistent spacing** — Noted but not refactored in this pass (existing p-4/p-6 choices are mostly coherent per section; defer to future polish).
8. **Inconsistent CardHeader padding** — Same as #7, deferred.
9. ~~**Browser `confirm()`**~~ — All 3 `confirm()` calls replaced with a new `useConfirmDialog()` hook (in `components/common/ConfirmDialog.tsx`) that wraps shadcn `AlertDialog`. Supports destructive variant, async/await API.
10. **Inline form validation** — Deferred to separate task (scope decision: touches every form and benefits from a dedicated refactor).

### Files Added
- `app/src/components/common/ConfirmDialog.tsx` — `useConfirmDialog()` hook returning `{ confirm, dialog }`, Promise-based API replacing `confirm()`.
- `app/src/components/common/EmptyState.tsx` — Reusable empty state with `default` / `search` variants.
- `app/src/components/common/ErrorState.tsx` — Error state with optional retry handler.
- `app/src/components/common/SectionSkeleton.tsx` — `ListSkeleton` and `StatsSkeleton` for loading states.
- `docs/superpowers/artifacts/2026-04-15-phase4-ui-patterns.html` — AiDesigner-generated visual reference.

### Files Modified
- `app/src/App.tsx` — Added skip-to-content link and `id="main-content"` anchor on `<main>`.
- `app/src/sections/CategoriesSection.tsx` — `confirm()` → `useConfirmDialog()`, mobile-safe MoreVertical button with `aria-label`.
- `app/src/sections/InventorySection.tsx` — `confirm()` → `useConfirmDialog()` with product-name in description.
- `app/src/sections/IncomeExpenseSection.tsx` — Both delete buttons made mobile-visible with `aria-label`.
- `app/src/sections/EnhancedAttendanceSection.tsx` — Bulk-delete `confirm()` → `useConfirmDialog()`.

### Deferred (intentional)
- Inline form validation feedback (item #10) — complex, touches every form. Track separately.
- Button style unification (item #6), spacing/padding normalization (#7, #8) — low-severity polish; changing all cards mechanically risks visual regressions. Defer until a dedicated design pass.
- Rendering skeleton/empty/error components inside sections — components are ready but mock data is always present, so they have no consumer yet. Wire them up when real data fetching replaces the static mock data.

### Verification
- `npm run build` passes (2747 modules, zero TS errors)
- No remaining `confirm()` or `opacity-0 group-hover` in `app/src/sections`

---

## Phase 5: PRD Gap Fixes (DONE)

### Changes Made
1. **CSV export implemented** — New `app/src/lib/csvExport.ts` utility (Blob + UTF-8 BOM, no new dep). Wired into `ReportsSection` (exports income/expenses/products as three CSVs) and `EnhancedAttendanceSection` (exports attendance records).
2. **PDF/Excel marked as "Soon"** — Buttons disabled with `<Badge variant="secondary">Soon</Badge>`; header export button rewired to CSV.
3. **Fixed expenses configurable** — In `IncomeExpenseSection`, the hardcoded 7-line breakdown is now state-backed and persisted to `localStorage` under key `sms.fixedExpenses.v1`. A Pencil button opens an inline edit dialog; total is derived from the array.
4. **QR scanner tagged as "Demo"** — Camera scanning not yet wired; `Staff Check-in QR Code` card now shows a `Demo` badge and the description explains the simulator below is the test path.
5. **Sample data made realistic** — `sampleMonthlyData` in `store.ts` now has a negative-profit month (Mar), two flat months (Feb, Sep), and a revenue dip in Aug. Breaks the "only growth" pattern.

### Deferred (intentional)
- **QR camera wiring** — requires MediaDevices API + QR library (jsQR/@zxing/browser). Separate task.
- **Product image uploads** — requires file storage / data-url handling. Separate task.
- **Staff performance calculation** — requires attendance→performance aggregation logic. Separate task.
- **PDF / Excel export** — parked behind "Soon" badges; re-enable once a generator is chosen (e.g., jspdf, xlsx).

### Files Added
- `app/src/lib/csvExport.ts` — `rowsToCsv()` + `downloadCsv()` with UTF-8 BOM.

### Files Modified
- `app/src/sections/ReportsSection.tsx` — Real CSV export, Soon badges on PDF/Excel.
- `app/src/sections/EnhancedAttendanceSection.tsx` — CSV export for attendance, Excel marked Soon, QR card marked Demo.
- `app/src/sections/IncomeExpenseSection.tsx` — State-backed fixed expenses + edit dialog + localStorage.
- `app/src/data/store.ts` — Realistic `sampleMonthlyData` with down months.

### Verification
- `npm run build` passes (2748 modules, zero TS errors).

---

## Verification

After each phase:
1. `npm run build` passes
2. `npm run lint` shows no new errors
3. Dev server starts without console errors
4. Visual check of Dashboard, Inventory, and Attendance sections
