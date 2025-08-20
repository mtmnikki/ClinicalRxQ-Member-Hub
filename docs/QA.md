QA checklist for edits (React + TypeScript)

1) Syntax & Types
- Run: node scripts/lint.mjs
- Fixable issues: node scripts/lint.mjs --fix
- Never declare functions or variables inside JSX or inside blocks where JSX is expected.

2) Hooks & React
- No conditional hooks. Follow react-hooks/exhaustive-deps guidance.

3) Design System
- For shadcn Button with variant="outline", always include className="bg-transparent ...".
- Verify color contrast on gradients and text readability.

4) Structure & Navigation
- Confirm routes render with react-router HashRouter.
- Check Home is never blank; ensure some content always shows.

5) Regression Scan
- Search patterns to catch previous issues:
  - function inside JSX: `</section>` followed by `function` without closing component.
  - outline buttons: `variant="outline"` without `bg-transparent`.

6) Visual QA
- Verify key pages load without console errors: Home, Programs, ProgramDetail (all slugs), About, Contact, Dashboard (behind auth).

Notes
- ESLint config lives at .eslintrc.cjs. We avoid editing package.json scripts per project constraints. Use the node runner above.