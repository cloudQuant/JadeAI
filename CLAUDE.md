# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JadeAI is an AI-powered smart resume builder built with Next.js 16, React 19, and TypeScript. Features include drag-and-drop editing, real-time AI optimization, 50 templates, PDF export, and multi-language support (Chinese/English).

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack

# Build & Type Check
pnpm build            # Production build
pnpm type-check       # TypeScript type checking
pnpm lint             # Run ESLint

# Database (Drizzle ORM)
pnpm db:generate      # Generate migrations from schema (SQLite)
pnpm db:generate:pg   # Generate migrations (PostgreSQL)
pnpm db:migrate       # Execute database migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:seed          # Seed database with sample data
```

## Architecture

### Database Abstraction Layer

The database layer uses a **dual-adapter pattern** supporting both SQLite (default) and PostgreSQL. Schema is defined once in `src/lib/db/schema.ts` and shared between adapters.

- `src/lib/db/index.ts` - Single entry point that initializes the appropriate adapter based on `DB_TYPE` env var
- `src/lib/db/adapter.ts` - `DatabaseAdapter` interface
- `src/lib/db/adapters/sqlite.ts` - SQLite implementation using `better-sqlite3`
- `src/lib/db/adapters/postgresql.ts` - PostgreSQL implementation using `drizzle-orm/pg`

**Key**: Always import `db` from `src/lib/db/index.ts`, never directly from adapters. Await `dbReady` before queries to ensure migrations have run.

### State Management (Zustand)

- `resume-store.ts` - Resume data (currentResume, sections, autosave logic)
- `editor-store.ts` - Editor UI state (selection, drag, undo/redo stacks)
- `ui-store.ts` - Global UI state (modals, toasts, sidebar)
- `settings-store.ts` - User settings (persisted to localStorage)
- `tour-store.ts` - Interactive tour state

**Autosave pattern**: Mutations in `resume-store` automatically schedule a debounced save via `_scheduleSave()`. The delay respects `settings-store.autoSaveInterval`.

### AI Integration

AI features use Vercel AI SDK v6. The `src/lib/ai/` directory contains:

- `tools.ts` - Executable tools that AI can call (`updateSection`, `addSection`, `rewriteText`, `suggestSkills`, `analyzeJdMatch`, `translateResume`)
- `provider.ts` - Model instantiation from user-configured API keys
- `prompts.ts` - System prompts for different AI tasks
- `*-schema.ts` - Zod schemas for structured outputs

**Critical**: AI tools execute server-side database mutations directly. After AI tool calls, the frontend must refetch resume data to stay in sync.

### i18n (next-intl)

- Routes are locale-prefixed: `/zh/dashboard`, `/en/editor/[id]`
- `src/middleware.ts` handles locale redirection and auth guards
- Translations in `messages/zh.json` and `messages/en.json`
- Use `useTranslations()` in components

### Auth Pattern

Two modes via `NEXT_PUBLIC_AUTH_ENABLED`:

1. **OAuth mode** (`true`) - NextAuth.js with Google OAuth, session required
2. **Fingerprint mode** (`false`) - FingerprintJS generates browser ID as `userId`, zero-config

In fingerprint mode, client sends `X-Fingerprint` header; server upserts user by fingerprint ID.

### Resume Data Model

Resumes have sections; each section has a `type` and `content` (JSONB):

- `personal_info` - `{ fullName, jobTitle, email, phone, location, website, ... }`
- `summary` - `{ text }`
- `work_experience` - `{ items: [{ id, company, position, startDate, endDate, ... }] }`
- `education` - `{ items: [{ id, institution, degree, field, ... }] }`
- `skills` - `{ categories: [{ id, name, skills: string[] }] }`
- `projects` - `{ items: [{ id, name, description, technologies, ... }] }`
- `certifications`, `languages`, `custom` - `{ items: [...] }`

All items/categories **must have an `id`** field. The store auto-generates IDs for items missing them during `setResume()`.

### PDF Export

Each of the 50 templates has a dedicated export handler in `src/app/api/resume/[id]/export/route.ts`. PDF generation uses Puppeteer Core with `@sparticuz/chromium` for server-side rendering.

## Environment Variables

Key variables (see `.env.example`):

- `NEXT_PUBLIC_AUTH_ENABLED` - Enable OAuth (true) or fingerprint mode (false)
- `AUTH_SECRET` - Required for session encryption
- `DB_TYPE` - `sqlite` (default) or `postgresql`
- `DATABASE_URL` - PostgreSQL connection string (when DB_TYPE=postgresql)
- `SQLITE_PATH` - SQLite file path (defaults to `./data/jade.db`)
- `NEXT_PUBLIC_DEFAULT_LOCALE` - `zh` or `en`

**No server-side AI env vars needed** - users configure their own API keys in-app via settings.

## Important Notes

1. **Item ID handling**: When updating section content with items/categories arrays, always ensure each item has an `id` field (use `crypto.randomUUID()` or the utility `generateId()`).

2. **AI tool synchronization**: After AI tools modify the database, the frontend `resume-store` becomes stale. Always refetch resume data after AI operations complete.

3. **Autosave cancellation**: When loading new resume data (`setResume`), any pending autosave timeout is cleared to prevent stale data from overwriting fresh data.

4. **Section type validation**: The `updateSection` tool includes logic to handle AI mistakes (e.g., AI sends `field="text"` for an items-based section). It auto-corrects to `field="items"` or `field="categories"`.

5. **Database migrations**: When modifying `schema.ts`, run `pnpm db:generate` (or `db:generate:pg` for PostgreSQL), then `pnpm db:migrate`.

6. **Template labels**: Template names are localized. Use `getTemplateLabel(template, locale)` from `src/lib/template-labels.ts`.

7. **Zod v4**: This project uses Zod v4. Import from `zod/v4` and use `z.v4.` or direct `z.` exports for schema definitions.
