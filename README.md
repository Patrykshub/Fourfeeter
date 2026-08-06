# Fourfeeter

A lightweight SPA blog built with React + TypeScript + Tailwind CSS and Lucide icons, backed by Supabase for data and auth. Available in English, Polish, and German.

## Quick start

1. Install deps:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and anon key (Project Settings -> API in the Supabase dashboard).

3. Run the SQL in `supabase/schema.sql` against your Supabase project (SQL Editor -> New query -> paste -> Run) to create the required tables, storage bucket policies, and row-level security rules.

4. Run dev server:

```bash
npm run dev
```

Admin login is via the lock icon and uses Supabase email/password auth — create the admin user in the Supabase dashboard (Authentication -> Users).

## Deployment

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`. The workflow needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as repository secrets (Settings -> Secrets and variables -> Actions).
