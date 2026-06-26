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

The login page has two one-click demo buttons for judges. No typing required.

| Button | Email | Password | Lands on |
|---|---|---|---|
| Student Demo | `student@mentoria.local` | `student123` | `/dashboard` |
| Admin Demo | `admin@mentoria.local` | `admin123` | `/dashboard` (Admin link visible in nav) |

**Important — accounts must exist in Supabase first.**
Before the demo works, create both users manually in the Supabase dashboard under **Authentication → Users → Invite user** (or Add user), then run the following in the SQL Editor to mark them as onboarded and set the admin role:

```sql
-- After creating both users in Supabase Auth, get their UUIDs from Auth → Users, then:

UPDATE profiles SET onboarded = true WHERE id = '<student-user-uuid>';

UPDATE profiles SET onboarded = true, role = 'admin' WHERE id = '<admin-user-uuid>';
```

---

## Deployment

### Platform

Vercel (free tier) + Supabase (free tier).

---

### Step 1 — Push to GitHub

Make sure the latest code is pushed to your GitHub repository:

```bash
git push origin main
```

Verify that `.env.local` is **not** committed (it is gitignored via `.env*`).

---

### Step 2 — Import into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Select your GitHub repository.
4. Vercel auto-detects Next.js — leave all build settings at their defaults.

---

### Step 3 — Add Environment Variables in Vercel

In the Vercel project settings under **Settings → Environment Variables**, add exactly these two variables:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xyzxyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Both values are found in your Supabase project under **Settings → API**.

Set them for all three environments: **Production**, **Preview**, and **Development**.

> **Security — do not add `SUPABASE_SERVICE_ROLE_KEY` to Vercel.** The service role key bypasses all Row Level Security policies and must never be exposed in a browser-accessible environment. Only the two `NEXT_PUBLIC_*` keys listed above are needed and safe.

Then click **Deploy**.

---

### Step 4 — Note your Vercel URL

After the first deploy finishes, Vercel gives you a URL like:

```
https://mentoria-hub.vercel.app
```

(or a custom domain if you set one)

---

### Step 5 — Configure Supabase Auth Settings

In your Supabase project, go to **Authentication → URL Configuration** and set:

| Setting | Value |
|---|---|
| **Site URL** | `https://your-project.vercel.app` |
| **Redirect URLs** | `https://your-project.vercel.app/auth/callback` |

Replace `your-project.vercel.app` with your actual Vercel URL.

> **Why this matters:** Supabase blocks OAuth and magic-link redirects to any URL not on this list. Without it, Google Sign-In and email confirmation links will fail in production.

---

### Step 6 — Verify Row Level Security

All user-data tables must have RLS enabled so that users can only access their own rows. Run this query in the Supabase SQL Editor to confirm:

```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'saved_opportunities',
    'lesson_progress',
    'learning_dna',
    'notes',
    'note_links',
    'note_tags',
    'tags'
  )
ORDER BY tablename;
```

Every row in the `rowsecurity` column must show `true`. If any table shows `false`, run `ALTER TABLE public.<tablename> ENABLE ROW LEVEL SECURITY;` for that table and re-apply the policies from `supabase/schema.sql`.

Tables that must have RLS enabled:

- `learning_dna` — stores each user's quiz result
- `notes` — user's personal notes
- `tags` — tag names scoped per user
- `note_tags` — links between notes and tags
- `note_links` — directional links between notes

---

### Step 7 — Verify the deployment

1. Open your Vercel URL.
2. Sign up or use the demo login buttons on `/login`.
3. Confirm you land on `/dashboard` after login.
4. Confirm unauthenticated visits to `/dashboard` redirect to `/login`.

---

### Redeployments

Every `git push origin main` triggers an automatic Vercel redeploy. No manual steps needed after initial setup.

---

## Deployment Checklist

Use this checklist before going live or handing off to judges.

### Vercel Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel (Production + Preview + Development)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in Vercel (Production + Preview + Development)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **not** present in Vercel env vars

### Supabase Auth Configuration

- [ ] **Site URL** set to `https://your-project.vercel.app` under **Authentication → URL Configuration**
- [ ] **Redirect URLs** includes `https://your-project.vercel.app/auth/callback`
- [ ] If using Google OAuth: Google OAuth callback URL `https://your-project.vercel.app/auth/callback` is added to the allowed redirect URIs in the Google Cloud Console and in Supabase **Authentication → Providers → Google**

### Database

- [ ] `supabase/schema.sql` has been run in the Supabase SQL Editor
- [ ] RLS verification query (Step 6 above) shows `true` for all eight tables
- [ ] Optional: `supabase/seed.sql` run for sample opportunities and courses

### Demo Accounts

- [ ] `student@mentoria.local` (password: `student123`) created in **Authentication → Users**
- [ ] `admin@mentoria.local` (password: `admin123`) created in **Authentication → Users**
- [ ] Both accounts marked onboarded and admin role set (see **Demo Login** section above)
- [ ] Demo buttons on `/login` work end-to-end

### Final Smoke Test

- [ ] Landing page (`/`) loads without errors
- [ ] Student demo login lands on `/dashboard`
- [ ] Admin demo login shows **Admin** link in nav
- [ ] `/vault` loads the notes editor and knowledge graph
- [ ] `/learning-dna` quiz completes and saves result
- [ ] Unauthenticated visit to `/dashboard` redirects to `/login`
