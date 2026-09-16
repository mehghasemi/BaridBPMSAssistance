# Development and Maintenance Guide

## Prerequisites

- Node.js LTS
- npm
- Windows users can start with `Start-Formyar.cmd`.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite development server. |
| `npm run build` | Type-check and create `dist/`. |
| `npm run test:domain` | Verify lifecycle transition rules. |
| `npm run db:generate` | Generate Prisma Client. |
| `npm run db:push` | Synchronize SQLite schema. |
| `npm run db:seed` | Add idempotent Persian sample data. |

## Adding a new field type

1. Add the database enum value in `prisma/schema.prisma`.
2. Add the client-side `FieldKind` union and Persian label in `src/App.tsx`.
3. Define preview behavior in `ReviewAndSubmit`.
4. Extend validation if the type has mandatory configuration.
5. Add it to Excel export columns if it introduces metadata not represented today.

## Adding a workflow terminal status

1. Add `WorkflowTerminalStatus` in Prisma.
2. Add `TerminalStatus` and `terminalLabels` in the UI.
3. Verify action editing clears either terminal status or target stage to keep the exclusive rule.
4. Update the terminal-path validation if the business rule changes.

## Backend migration contract

Create protected endpoints along these lines:

```text
GET    /api/requests
POST   /api/requests
GET    /api/requests/:id
PATCH  /api/requests/:id
POST   /api/requests/:id/comments
POST   /api/requests/:id/status-transitions
POST   /api/requests/:id/attachments
GET    /api/requests/:id/export.xlsx
GET    /api/requests/:id/export.pdf
```

Server-side requirements:

- derive the current user from authentication, never from browser role selection;
- enforce organization ownership and role access for every request;
- validate payloads and state transitions before persistence;
- create `ChangeHistory` records transactionally with status/structural changes;
- store uploaded bytes outside SQLite/PostgreSQL and save `Attachment` metadata;
- generate Persian PDF server-side using an RTL-capable font/shaping pipeline.

## Quality checklist

- Test customer, specialist, and manager navigation.
- Verify RTL layout at desktop and mobile widths.
- Confirm all buttons have a visible effect, navigation, update, download, or validation response.
- Use Persian error text that includes issue, location, and suggested solution.
- Build before handing off changes.
