# Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve static export safety, modal accessibility, and repository hygiene while keeping the current UI behavior intact.

**Architecture:** Keep the current Next.js static export setup and UI layout, add a static export guard at the app root, and improve accessibility within the existing modal component by adding focus management and keyboard interactions. Consolidate duplicated hooks and lockfiles without changing any runtime behavior.

**Tech Stack:** Next.js (App Router), React 19, Tailwind CSS, motion/react, TypeScript, npm

### Task 1: Add static export guard

**Files:**
- Modify: `app/layout.tsx:1`
- Test: Manual verification (no existing test harness)

**Step 1: Write the failing test**

Create `docs/plans/manual-checks/static-export-guard.md` with a checklist that expects a build error when server-only APIs are used in static export mode.

**Step 2: Run test to verify it fails**

Run: `npm run build` after temporarily adding a server-only call (e.g. `headers()`) in a component.  
Expected: Build does NOT fail yet (no guard), so the checklist fails.

**Step 3: Write minimal implementation**

Add `export const dynamic = 'error'` to `app/layout.tsx` (top-level export).

**Step 4: Run test to verify it passes**

Run: `npm run build` again with the same temporary server-only call.  
Expected: Build fails with an error about dynamic usage in static export.

**Step 5: Commit**

```bash
git add app/layout.tsx docs/plans/manual-checks/static-export-guard.md
git commit -m "chore: guard static export from dynamic features"
```

### Task 2: Improve modal accessibility (keyboard + focus trap)

**Files:**
- Modify: `components/morphing-media.tsx`
- Test: Manual verification (no existing test harness)

**Step 1: Write the failing test**

Create `docs/plans/manual-checks/modal-a11y.md` with a checklist for keyboard navigation:
- Tab reaches media card
- Enter/Space opens modal
- Focus stays trapped in modal
- Escape closes modal
- Focus returns to trigger

**Step 2: Run test to verify it fails**

Manual: try Tab/Enter/Space with keyboard.  
Expected: Modal cannot be opened and focus is not trapped.

**Step 3: Write minimal implementation**

In `components/morphing-media.tsx`:
- Add `role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-haspopup="dialog"` on the trigger.
- Add `role="dialog"`, `aria-modal="true"`, `aria-label` and `tabIndex={-1}` on the modal container.
- Store the last focused element on open; restore focus on close.
- Implement a simple focus trap for Tab/Shift+Tab while open.

**Step 4: Run test to verify it passes**

Manual: repeat the keyboard checklist.  
Expected: all steps pass.

**Step 5: Commit**

```bash
git add components/morphing-media.tsx docs/plans/manual-checks/modal-a11y.md
git commit -m "fix: add keyboard and focus management to modal"
```

### Task 3: Consolidate duplicated hooks

**Files:**
- Modify: `components/ui/use-toast.ts`
- Modify: `components/ui/use-mobile.tsx`
- Test: Manual verification (no existing test harness)

**Step 1: Write the failing test**

Create `docs/plans/manual-checks/hooks-consolidation.md` with a checklist:
- Imports from `components/ui/use-toast` still work
- Imports from `components/ui/use-mobile` still work
- No duplicate logic remains

**Step 2: Run test to verify it fails**

Manual: compare files; duplicates still exist.  
Expected: checklist fails.

**Step 3: Write minimal implementation**

- Replace `components/ui/use-toast.ts` with a re-export from `hooks/use-toast`.
- Replace `components/ui/use-mobile.tsx` with a re-export from `hooks/use-mobile`.
- Keep `'use client'` in the re-exported modules where needed.

**Step 4: Run test to verify it passes**

Run: `npm run lint`  
Expected: lint passes.

**Step 5: Commit**

```bash
git add components/ui/use-toast.ts components/ui/use-mobile.tsx docs/plans/manual-checks/hooks-consolidation.md
git commit -m "chore: dedupe hooks via re-exports"
```

### Task 4: Standardize on npm lockfile

**Files:**
- Delete: `pnpm-lock.yaml`
- Test: Manual verification (no existing test harness)

**Step 1: Write the failing test**

Create `docs/plans/manual-checks/npm-lockfile.md` with a checklist:
- Only `package-lock.json` remains
- `npm install` completes

**Step 2: Run test to verify it fails**

Manual: check repo; `pnpm-lock.yaml` still exists.  
Expected: checklist fails.

**Step 3: Write minimal implementation**

Delete `pnpm-lock.yaml`.

**Step 4: Run test to verify it passes**

Run: `npm install`  
Expected: completes (may warn about peer deps but succeeds).

**Step 5: Commit**

```bash
git add -u pnpm-lock.yaml docs/plans/manual-checks/npm-lockfile.md
git commit -m "chore: remove pnpm lockfile"
```

### Task 5: Clean up manual check docs

**Files:**
- Create: `docs/plans/manual-checks/README.md`

**Step 1: Write the failing test**

Create a checklist file `docs/plans/manual-checks/README.md` describing how to run manual checks.  
Expected: missing before creation.

**Step 2: Run test to verify it fails**

Run: `rg -n "manual checks" docs/plans/manual-checks/README.md`  
Expected: file not found before creation.

**Step 3: Write minimal implementation**

Add a README explaining each manual check file and when to run them.

**Step 4: Run test to verify it passes**

Run: `rg -n "manual checks" docs/plans/manual-checks/README.md`  
Expected: match found.

**Step 5: Commit**

```bash
git add docs/plans/manual-checks/README.md
git commit -m "docs: add manual checks index"
```
