# Mentoria Hub

Mentoria Hub is an EdTech platform designed for students in grades 8–11 in Kazakhstan and internationally. It helps students discover educational opportunities (scholarships, olympiads, research programs, SAT/IELTS prep), complete asynchronous courses at their own pace, understand their learning style through a personality quiz, and organize their knowledge in a personal notes vault with a visual knowledge graph.

---

## Main Features

| Feature | What it does |
|---|---|
| **Opportunities** | Browse and save scholarships, olympiads, research programs, and more |
| **Courses** | Asynchronous lessons with progress tracking |
| **Learning DNA Quiz** | 13-question quiz that classifies your learning style (Explorer, Builder, Researcher, etc.) and recommends matching opportunities and courses |
| **Student Vault** | Personal notes editor with tagging and linking between notes |
| **Knowledge Graph** | Visual graph that shows your notes as nodes and the links between them |
| **Admin Panel** | CRUD interface for managing opportunities, courses, and lessons |
| **Theme Toggle** | Light and dark mode, persisted per browser |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Global CSS with custom properties (no Tailwind utility classes) |
| Auth & Database | Supabase (PostgreSQL) |
| Hosting | Vercel |

---

## How the System Works

### Frontend Routes

```
/                   Landing page (public)
/login              Sign in
/register           Create account
/onboarding         Fill in profile after first login (required before accessing the app)
/dashboard          Personal overview — saved items, course progress, DNA result
/opportunities      Browse all opportunities; save or unsave
/courses            Course catalog (interactive stacked deck)
/courses/[id]       Individual course with lessons and progress
/learning-dna       Take or retake the Learning DNA quiz
/vault              Notes editor + knowledge graph
/admin              Admin panel (only visible to users with role = 'admin')
```

### Supabase Auth

- Users sign up and sign in via Supabase email/password auth.
- A session cookie is set automatically by the `@supabase/ssr` middleware helper.
- On every request, `middleware.ts` checks whether a valid session exists and whether the user has completed onboarding.

### Database Tables

| Table | Purpose |
|---|---|
| `profiles` | One row per user — name, grade, city, interests, onboarding status, role |
| `opportunities` | Admin-created opportunities (title, category, tags, deadline, link) |
| `saved_opportunities` | Junction table linking users to saved opportunities |
| `courses` | Courses with title, category, description |
| `lessons` | Lessons belonging to a course, ordered by position |
| `lesson_progress` | Tracks which lessons each user has completed |
| `learning_dna` | One row per user — DNA type + full score breakdown from the quiz |
| `notes` | User notes with title, content, and x/y position on the graph canvas |
| `note_links` | Directional links between two notes (used to draw edges on the graph) |
| `note_tags` | Junction table linking notes to tags |
| `tags` | Tag names scoped per user |

### Server Actions

Next.js Server Actions (`src/lib/actions/`) handle all writes from Client Components without needing a separate API layer:

- `dna.ts` — save or retrieve a user's DNA quiz result
- `vault.ts` — create, update, delete notes; manage tags and note links
- `admin.ts` — CRUD for opportunities, courses, and lessons
- `opportunities.ts` — save and unsave opportunities
- `progress.ts` — mark lessons as complete

### Protected Routes

`middleware.ts` enforces three rules on every request:

1. Unauthenticated users visiting a protected route are redirected to `/login`.
2. Authenticated users visiting `/login` are redirected to `/dashboard`.
3. Authenticated users who have not completed onboarding are redirected to `/onboarding` (except for `/onboarding` and `/admin` themselves).

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create a file called `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project under **Settings → API**.

### 3. Run the database migrations

In your Supabase project, open the **SQL Editor** and run the contents of:

- `supabase/schema.sql` — creates all tables, RLS policies, and triggers
- `supabase/seed.sql` — optional sample data

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Common Problems

**The app shows a blank page or crashes immediately**
→ `.env.local` is missing or the Supabase URL/key are wrong. Double-check both values.

**I can log in but get stuck in a redirect loop**
→ The `profiles` table row for your user was not created. This usually means the `schema.sql` trigger that auto-creates a profile on signup was not run. Re-run `schema.sql` in the Supabase SQL editor.

**I can log in but keep getting redirected to `/onboarding`**
→ Your profile exists but `onboarded = false`. Complete the onboarding form, or manually run `UPDATE profiles SET onboarded = true WHERE id = '<your-user-id>';` in the Supabase SQL editor.

**The Admin link does not appear in the nav**
→ Your profile's `role` column is not set to `'admin'`. Run `UPDATE profiles SET role = 'admin' WHERE id = '<your-user-id>';`.

---

## Demo Login

> Add demo credentials here before submission.

---

## Deployment

The project is deployed on Vercel. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.

> Add the live URL here before submission.
