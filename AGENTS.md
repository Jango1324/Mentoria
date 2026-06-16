# AGENTS.md

## Project

Mentoria Hub

An EdTech platform that helps students discover educational opportunities and complete asynchronous courses.

Target users:

* Grades 8–11
* Kazakhstan and international students
* Students interested in STEM, Business, Research, Olympiads, Scholarships, SAT/IELTS, and University Admissions

## Tech Stack

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Supabase
* Vercel

## Team Structure

### Zhangir (Backend)

Responsible for:

* Supabase setup
* Database schema
* Authentication
* User profiles
* Recommendation logic
* Saved opportunities
* Dashboard data
* Course progress
* Deployment

Primary folders:

src/lib/
src/lib/supabase/
src/app/login/
src/app/onboarding/
src/app/dashboard/
src/types/
supabase/

### Frontend Developer

Responsible for:

* Landing page
* Opportunities UI
* Courses UI
* Admin UI
* Responsive design
* Tailwind styling
* Mock content

Primary folders:

src/components/
src/app/page.tsx
src/app/opportunities/
src/app/courses/
src/app/admin/
src/data/

## Architecture Rules

* Use App Router.
* Prefer Server Components.
* Use Client Components only when hooks or browser APIs are required.
* Use TypeScript everywhere.
* Use Tailwind for styling.
* Keep components small and reusable.
* Avoid unnecessary dependencies.
* Avoid Redux.

## Git Rules

Backend branch:
backend

Frontend branch:
frontend

Do not modify files owned by the other developer unless required.

Create focused commits.

Example:

git commit -m "Add authentication flow"

Avoid large commits touching unrelated features.

## MVP Priority

1. Authentication
2. Onboarding
3. Opportunities Catalog
4. Save Opportunity
5. Courses
6. Lesson Progress
7. Dashboard
8. Admin CRUD
9. Deployment

## Environment Variables

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Never commit .env.local.
