# Project Context: Cash Flow Forecaster v2.0

## Architecture Overview
- **Framework:** Next.js (App Router)
- **State Management:** Zustand (`src/stores/`)
- **Architecture:** Feature-Based (Modular) Architecture
- **Tech Stack:** TypeScript, Material UI (MUI), Vitest (Testing), Playwright (E2E)

## Key Folder Responsibilities
- `src/app/`: Next.js App Router (Pages/Layouts)
- `src/modules/`: Domain-specific features (Dashboard, Transactions, Scenarios, Settings, etc.)
  - Each module contains: `components/`, `hooks/`, `services/`, `interfaces/`, `index.ts` (Barrel Export).
- `src/shared/`: Global reusable code
  - `components/`: Atomic UI components (Buttons, Modals, Tables, etc.)
  - `hooks/`: Global utility hooks (`useNotification`, `useCountUp`)
  - `services/`: Global API client (`apiClient.ts`)
  - `utils/`: Global helper functions
- `src/stores/`: Zustand global state definitions

## Coding Rules & Conventions
1. **Barrel Export:** Every folder MUST have an `index.ts` to export its contents.
2. **Clean Imports:** Use path aliases (e.g., `@/modules/dashboard`, `@/shared/components`). Do not import deep file paths.
3. **Naming Convention:**
   - Numbers: `n` prefix (e.g., `nAmount`)
   - Strings: `s` prefix (e.g., `sDescription`)
   - Boolean: `is` or `s` prefix (e.g., `isCompleted`)
   - Lists: `lst` prefix (e.g., `lstTransactions`)
   - Objects: `obj` prefix (e.g., `objMetrics`)
4. **Interactivity:** Components with event handlers/hooks MUST include `'use client';` at the top.
5. **Responsiveness:** Always use MUI `Grid` for responsive layouts.

## Current Project Constraints
- Backend Communication: Use `apiClient` from `src/shared/services/` for all requests.
- Confidence Scoring: Metrics use weighting (Completed=1.0, Recurring=0.9, Preview=0.3, Other=0.5).
- Do not use `any` or `unknown` types.