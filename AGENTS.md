# AI Maintenance Guide

## Project goal

Formyar is a Persian, RTL MVP for collecting administrative-form and workflow-design requirements from customers. It replaces the current spreadsheet/PDF handoff with a guided browser workflow.

## How to run

```powershell
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

On Windows, `Start-Formyar.cmd` is the one-click launcher. It calls `Start-Pargar.ps1`, which prepares the database and opens the local site.

## Required checks after code changes

```powershell
npm run test:domain
npm run build
```

If the Prisma schema changes, also run `npm run db:push` and `npm run db:seed`.

## Current architecture

- `src/App.tsx`: current UI, interaction state, local browser persistence, exports, and demo screens.
- `src/styles.css`: RTL responsive visual system.
- `src/domain/request-status.ts`: request status transition rules. Keep workflow/status decisions here instead of scattering them through UI code.
- `prisma/schema.prisma`: durable data model intended for the future server/API layer.
- `prisma/seed.js`: idempotent sample data; never add destructive delete/reset logic to regular seed execution.

## Important limitations

This is a client-side MVP. UI records are kept in `localStorage`; the SQLite model is prepared but not yet connected to an HTTP API. Do not claim cross-browser, multi-user synchronization until a backend is added.

Binary attachments are only selected and listed by the current browser session. A future API must store them in controlled file storage and save metadata in `Attachment`.

## Implementation conventions

- Keep UI language Persian and RTL; do not expose BPMN terminology to customers.
- Use plain, non-technical labels such as `گردش فرم`.
- Preserve the staged request workflow: basic information, form design, workflow design, review/export.
- Every workflow action is a separate record. Never represent several actions in one text value.
- Before sending a request, validate the rules in `validationIssues` and status transitions in `request-status.ts`.
- Keep new file names ASCII/Latin unless the user explicitly asks otherwise.

## Safe next development steps

1. Add a Node/Express or similar API.
2. Use Prisma Client only on the server, not in browser code.
3. Replace `localStorage` draft state with API calls guarded by role authorization.
4. Add real authentication and organization scoping.
5. Replace the browser-print PDF path with a server-generated Persian PDF using the bundled Persian PDF utility.
6. Add integration and browser tests for each role.
