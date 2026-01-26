# Hooks Consolidation Check

Goal: Keep a single source of truth for hooks while preserving public imports.

Checklist:
- components/ui/use-toast re-exports hooks/use-toast.
- components/ui/use-mobile re-exports hooks/use-mobile.
- Existing imports from components/ui/* still work.
