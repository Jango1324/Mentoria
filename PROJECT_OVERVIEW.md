# Project Overview — Mentoria Hub

This document explains the architecture of Mentoria Hub for anyone reading the codebase for the first time.

---

## Folder Structure

```
src/
  app/              Next.js App Router — one folder per page
  components/       Shared UI components (nav, cards, loaders, etc.)
  lib/
    supabase/       Supabase client factories (server, browser, middleware)
    actions/        Server Actions — all database writes
    data/           Server-side read helpers — all database reads
    theme.ts        Theme token helpers
  types/            TypeScript types and the generated Supabase Database type

supabase/
  schema.sql        Full database schema — run this first
  seed.sql          Optional sample data
```

---

## App Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Public landing page, static |
| `/login` | `app/login/page.tsx` | Email/password sign-in |
| `/register` | `app/register/page.tsx` | Creates a Supabase auth user |
| `/onboarding` | `app/onboarding/page.tsx` | Collects name, grade, city, interests; sets `onboarded = true` |
| `/dashboard` | `app/dashboard/page.tsx` | Server Component — fetches saved items, course progress, DNA result |
| `/opportunities` | `app/opportunities/page.tsx` | Lists all active opportunities; save/unsave via Server Action |
| `/courses` | `app/courses/page.tsx` | Interactive stacked deck of all courses with progress |
| `/courses/[id]` | `app/courses/[id]/page.tsx` | Lesson list with completion checkboxes |
| `/learning-dna` | `app/learning-dna/page.tsx` | Quiz UI; result saved via Server Action |
| `/vault` | `app/vault/page.tsx` | Notes sidebar + markdown editor + knowledge graph |
| `/admin` | `app/admin/page.tsx` | CRUD for opportunities, courses, lessons — role-gated |

---

## Components

| Component | What it does |
|---|---|
| `AppNav` | Async Server Component — fetches user role and conditionally shows the Admin link |
| `ThemeToggle` | Client Component — toggles light/dark CSS class on `<html>` and persists to `localStorage` |
| `DisplayCourseCards` | Static decorative stacked card display used on the landing page |
| `CourseDeck` | Interactive Client Component — cycles through all courses via scroll or click |
| `AsciiBrainLoader` | Full-screen terminal-style loading animation shown while pages load |

---

## lib/actions — Server Actions

Server Actions are Next.js functions that run on the server and can be called directly from Client Components. They handle all writes.

| File | Actions |
|---|---|
| `dna.ts` | `saveDNAResult` — upserts the quiz result; `getUserDNA` — reads the current result |
| `vault.ts` | `createNote`, `updateNote`, `updateNotePosition`, `deleteNote` — note CRUD; `upsertTag`, `addTagToNote`, `removeTagFromNote` — tag management; `createLink`, `deleteLink` — note graph edges |
| `admin.ts` | CRUD for opportunities, courses, and lessons |
| `opportunities.ts` | `saveOpportunity`, `unsaveOpportunity` |
| `progress.ts` | `markLessonComplete`, `markLessonIncomplete` |

All actions start by calling `supabase.auth.getUser()` to confirm the session before touching the database.

---

## lib/data — Read Helpers

These are plain async functions called from Server Components to fetch data before rendering.

| File | Functions |
|---|---|
| `dna.ts` | Quiz questions, `calculateDNAType`, DNA type profiles, recommendation filters |
| `vault.ts` | `getNotes` (with tags), `getNoteLinks` |
| `courses.ts` | `getPublishedCourses`, `getCourseWithLessons`, `getUserCourseProgress`, `calculateCourseProgress` |
| `opportunities.ts` | `getOpportunities`, `getSavedOpportunityIds` |

---

## lib/supabase — Client Factories

| File | Used by |
|---|---|
| `server.ts` | Server Components, Server Actions, Route Handlers |
| `client.ts` | Client Components that need direct Supabase access (rare — most writes go through actions) |
| `middleware.ts` | `middleware.ts` at the root — refreshes the session cookie on every request |

The server client reads and sets cookies via Next.js `cookies()`. The browser client uses `localStorage`-backed tokens managed by the Supabase JS SDK.

---

## Supabase Schema

### Auth → Profile connection

When a user signs up, a PostgreSQL trigger (`on auth.users insert`) automatically creates a row in the `profiles` table with `onboarded = false` and `role = 'student'`. The middleware checks `profiles.onboarded` on every protected request and redirects to `/onboarding` if it is false.

### Learning DNA

After completing the 13-question quiz, the client calls the `saveDNAResult` Server Action, which upserts one row into `learning_dna` keyed on `user_id`. This means retaking the quiz overwrites the previous result. The `dna_type` column stores the winning type (e.g. `'Builder'`). The `dna_score_breakdown` column stores the full score map as JSON (e.g. `{ Explorer: 4, Builder: 10, ... }`).

### Student Vault and Knowledge Graph

Each note is a row in `notes` with `title`, `content` (markdown), and `pos_x`/`pos_y` coordinates used to position the node on the graph canvas. When a user links two notes in the editor, a row is inserted into `note_links` with `source_note_id` and `target_note_id`. The graph component (`app/vault/GraphView.tsx`) reads all notes and all links and draws them as SVG nodes and edges.

Tags work through a junction table: `tags` stores the tag name per user, and `note_tags` links tags to notes (many-to-many).

### Course Progress

`lesson_progress` has one row per `(user_id, lesson_id)` pair with a `completed` boolean. The dashboard and courses page compute a completion percentage by counting completed rows vs. total lessons for each course.

---

## Admin Panel

The admin panel (`/admin`) is a regular protected page with an additional role check — the middleware allows any authenticated, onboarded user through, but the page itself reads `profiles.role` and renders a 403 message if the role is not `'admin'`. The `AppNav` component separately hides the Admin link for non-admins using the same role check.

Admin users can create, edit, and delete opportunities, courses, and lessons via Server Actions in `lib/actions/admin.ts`.

---

## Auth Flow Summary

```
User visits /dashboard
      ↓
middleware.ts runs on every request
      ↓
updateSession() refreshes the session cookie via Supabase SSR
      ↓
No session?  → redirect /login
Session + not onboarded? → redirect /onboarding
Session + onboarded? → allow through
      ↓
Server Component renders — calls createClient() to fetch user-specific data
      ↓
Page rendered and sent to browser
```
