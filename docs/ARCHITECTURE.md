# Architecture and Data Model

## Runtime structure

The project is a Vite + React + TypeScript single-page application. The browser currently owns UI state and stores working drafts in `localStorage`. Prisma and SQLite provide the database contract for the later API implementation.

```text
Browser UI (React)
  ├─ guided request wizard
  ├─ customer / specialist / manager demo workspaces
  ├─ localStorage drafts and sample state
  ├─ XLSX client export
  └─ browser print for PDF saving

Prisma schema (future API boundary)
  ├─ SQLite for local MVP
  └─ PostgreSQL-compatible relational design for production
```

## Primary entities

| Entity | Responsibility |
|---|---|
| `Organization` | Customer organization owning requests and units. |
| `OrganizationalUnit` | Process-owning or responsible unit. |
| `User` | Customer, specialist, or administrator. |
| `FormDesignRequest` | Parent requirement record and lifecycle status. |
| `FormSection` / `FormField` | Form structure and per-field design settings. |
| `FieldOption` | Select/radio choices with code, title, sort order, and active flag. |
| `WorkflowStage` / `WorkflowAction` | Workflow stages and independent actions. |
| `Comment` | A question or response targeted at a request item. |
| `ChangeHistory` | Immutable operational audit records. |
| `Attachment` | File metadata. File bytes belong in external object/file storage. |

## Request lifecycle

```text
DRAFT
  -> SUBMITTED_BY_CUSTOMER
  -> UNDER_REVIEW
  -> CUSTOMER_COMPLETION_REQUIRED
  -> SUBMITTED_BY_CUSTOMER
  -> UNDER_REVIEW
  -> FINAL_APPROVED
  -> READY_FOR_DESIGN
  -> CLOSED
```

The allowed transitions are defined in `src/domain/request-status.ts`. A UI action or future API endpoint must call `canTransition` before writing a new status.

## Validation responsibilities

`validationIssues` in `src/App.tsx` currently covers UI-level pre-submit validation:

- form name and purpose;
- unique technical IDs;
- title and technical ID on each field;
- active options for select/radio fields;
- responsible role/unit on each workflow stage;
- one source and exactly one destination or terminal status per action;
- at least one reachable terminal path from the first workflow stage.

When adding a server, duplicate these rules in an API/domain validation layer. Client validation is a usability aid, not a security boundary.

## Browser storage keys

| Key | Content |
|---|---|
| `pargar-base-draft` | Basic request information and attachment metadata. |
| `pargar-form-draft` | Sections, fields, options, and field settings. |
| `pargar-workflow-draft` | Workflow stages and actions. |
| `pargar-comments-draft` | Demo questions/comments. |
| `pargar-history-draft` | Demo history events. |
| `pargar-admin-users` | Manager user demo data. |
| `pargar-templates` | Manager template demo data. |

These keys are a temporary local-MVP mechanism. API migration should preserve their data shapes where useful, then delete the browser fallback only after migration is complete.
