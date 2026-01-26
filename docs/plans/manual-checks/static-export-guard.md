# Static Export Guard Check

Goal: Ensure the app fails build when server-only features are used with output: 'export'.

Steps:
1) Temporarily add a server-only call (e.g. headers()) in an App Router file.
2) Run: npm run build
3) Expect: build fails with a dynamic usage error.
4) Remove the temporary call after the check.
