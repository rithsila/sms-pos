# Shop Management Web App - Deep Analysis & Fix Spec

**Date:** 2026-04-13
**Status:** In Progress (Phases 1-2 complete)

## Context

The Shop Management Web App is a React SPA for a Cambodian retail shop. A deep analysis found 200+ hardcoded colors, broken Tailwind-CSS token alignment, unused dependencies, type conflicts, UI inconsistencies, PRD gaps, and accessibility issues. This spec documents all findings and the fix plan.

## Approach: Fix Layer by Layer (Bottom-Up)

| Phase | What | Status |
|-------|------|--------|
| 1 | Config & cleanup | DONE |
| 2 | Design tokens & color system | DONE |
| 3 | Type unification | TODO |
| 4 | UI consistency | TODO |
| 5 | PRD gap fixes | TODO |

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

## Phase 3: Type Unification (TODO)

### Problems Found
1. **Duplicate Attendance types** - `Attendance` in types/index.ts vs `AttendanceRecord` in types/attendance.ts model the same concept differently.
2. **Duplicate AttendanceSection** - Both AttendanceSection.tsx (350 lines, old) and EnhancedAttendanceSection.tsx (1834 lines, current) exist.
3. **Inconsistent role typing** - `Staff.role` is `string` but `Employee.role` uses `UserRole` literal union.
4. **Loose category types** - `Product.category` is `string`, `Income.category` has only 3 options, `Expense.category` has only 5.

### Planned Fix
- Delete old `AttendanceSection.tsx`
- Remove old `Attendance` type from index.ts
- Unify on `AttendanceRecord` from attendance.ts
- Tighten `Staff.role` to use `UserRole` union
- Add proper category literal unions for Product

---

## Phase 4: UI Consistency (TODO)

### Problems Found
1. **No loading/skeleton states** in any section
2. **No error states** anywhere
3. **Empty states** inconsistent (some sections have them, some don't)
4. **Broken mobile interactions** - Delete buttons use `opacity-0 group-hover:opacity-100` (invisible on touch)
5. **Missing accessibility** - No ARIA labels on icon buttons, no skip-to-content link, progress bars use raw `<div>` instead of `<Progress>`
6. **Inconsistent button styles** - Mix of shadcn variants, custom btn-* classes, and inline gradient styles
7. **Inconsistent spacing** - CardContent uses p-4 or p-6 randomly, gaps vary between 3-6
8. **Inconsistent CardHeader padding** - pb-2, pb-3, pb-4 used randomly
9. **Browser confirm()** used instead of AlertDialog in 3 places
10. **No form validation feedback** - All validation uses toast only, no inline errors

### Planned Fix
- Standardize spacing (p-6 for content cards, p-4 for stat cards)
- Add ARIA labels to all icon buttons
- Fix mobile hover-only interactions (always show on mobile)
- Add AlertDialog for confirmations
- Add skeleton loading component
- Standardize empty states

---

## Phase 5: PRD Gap Fixes (TODO)

### Problems Found
1. **CSV/Excel export** - Buttons exist but no file generation logic
2. **QR code scanning** - QR displayed but no camera input
3. **Product images** - Type exists but never populated
4. **Staff performance** - Hardcoded percentages, no calculation
5. **Bulk operations** - Checkboxes render but bulk actions don't work
6. **Fixed expenses** - Hardcoded $2,622, not configurable
7. **Sample data** - Unrealistic (only growth, no bad months)

### Planned Fix
- Wire up CSV export with file-saver
- Make fixed expenses configurable via UI
- Improve sample data realism
- Mark non-functional features clearly in UI

---

## Verification

After each phase:
1. `npm run build` passes
2. `npm run lint` shows no new errors
3. Dev server starts without console errors
4. Visual check of Dashboard, Inventory, and Attendance sections
