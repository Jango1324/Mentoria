@AGENTS.md
# CLAUDE.md

You are assisting with Mentoria Hub.

Read AGENTS.md before making any changes.

## Important

This is a hackathon project with a 2-day deadline.

Prioritize:

* Working functionality
* Clean architecture
* Fast implementation
* Reusable components

Avoid:

* Premature optimization
* Large refactors
* Complex abstractions
* Unnecessary dependencies

## Ownership Rules

If working on backend tasks:

Allowed:

* src/lib
* src/lib/supabase
* src/app/login
* src/app/onboarding
* src/app/dashboard
* supabase

Avoid:

* src/app/page.tsx
* src/app/opportunities
* src/app/courses
* src/app/admin
* src/components

If working on frontend tasks:

Allowed:

* src/app/page.tsx
* src/app/opportunities
* src/app/courses
* src/app/admin
* src/components

Avoid:

* src/lib/supabase
* src/app/login
* src/app/onboarding
* src/app/dashboard
* supabase

## Coding Standards

* TypeScript only.
* Strong typing preferred.
* Use async/await.
* Prefer composition over duplication.
* Create reusable UI components.
* Follow Next.js App Router conventions.

## Before Writing Code

Always:

1. Explain the implementation plan.
2. List files that will be modified.
3. Keep changes focused.

## After Writing Code

Always provide:

* Summary of changes
* Files modified
* Any required commands
* Any environment variables needed

## Project Goal

Deliver a deployable MVP for Mentoria Hub consisting of:

* Authentication
* Student onboarding
* Opportunity discovery
* Saved opportunities
* Courses
* Progress tracking
* Dashboard
* Admin panel

The project must be deployable on Vercel.
