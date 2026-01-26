# Manual Checks

This folder tracks manual checks and verification steps for changes that do not have automated tests.

How to use:
- Open the relevant checklist file.
- Follow each step in order.
- Record any failures and fix before release.

Current checklists:
- static-export-guard.md: ensure static export fails on server-only usage
- modal-a11y.md: verify keyboard navigation and focus handling
- hooks-consolidation.md: confirm re-exported hooks still work
- npm-lockfile.md: confirm npm lockfile is the only one
