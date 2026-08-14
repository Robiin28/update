# Robel Hailu — Portfolio

Personal portfolio site built with Next.js, with a built-in admin panel for editing content without touching code — every save commits directly to this GitHub repo.

**Live site:** _add your Vercel URL here once deployed_

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling/animation:** Tailwind CSS, Framer Motion
- **3D/charts:** Three.js (`@react-three/fiber`), Recharts
- **Forms:** React Hook Form + Zod

## Content model

All site content lives as JSON in `app/data/`:

| File | Section |
|---|---|
| `projects.json` | Projects grid |
| `experiences.json` | Work experience timeline |
| `skills.json` | Skills & technologies |
| `education.json` | Education, volunteering, languages |
| `profile.json` | Portrait images, years of experience, resume/CV |

You can edit these files directly, or manage everything through the **admin panel** at `/admin` (see below) — both end up as commits to this repo, since the JSON files are what the site actually reads from at build/request time.

## Local development

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000` (or the next free port).

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `ADMIN_SECRET` | Random secret signing admin session cookies. Generate with `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | Password to log into `/admin` |
| `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | This repo — where admin edits get committed |
| `GITHUB_TOKEN` | Fine-grained GitHub PAT scoped to this repo with **Contents: Read and write** ([create one](https://github.com/settings/tokens?type=beta)) |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in page metadata/Open Graph tags |
| `NEXT_PUBLIC_DATABASE_MODE` | Keep as `json` — the app reads content from the JSON files above |

Without `GITHUB_TOKEN`/`ADMIN_PASSWORD` set, the public site still works fine — only `/admin` requires them.

## Admin panel

Go to `/admin`, log in with `ADMIN_PASSWORD`. Five tabs, each editing its corresponding JSON file above:

- **Projects** — add/edit/reorder projects, upload screenshots
- **Experience** — work history entries
- **Skills** — skill categories and levels
- **Background** — education, volunteering, languages
- **Profile** — years of experience, both portrait images, resume PDF

Every "Save & Publish" commits straight to `main` on GitHub. If deployed on Vercel with the GitHub integration connected, that push auto-triggers a redeploy — live in 1-2 minutes.

## Deployment

Deployed on [Vercel](https://vercel.com) (Next.js App Router needs a real Node server for the admin API routes — this can't run on static hosting like GitHub Pages). Import this repo into Vercel, set the same environment variables listed above in the project's Settings, and every push to `main` deploys automatically.

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs `npm run build` on every push/PR as a build-verification check, separate from Vercel's own deploy.
