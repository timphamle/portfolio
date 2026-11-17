# timphamle.com

My personal portfolio: a single-page, scroll-through site covering my experience, projects, education and a bit about me, with an in-depth page for every project.

**Stack:** Next.js (App Router, static export) · TypeScript · Tailwind CSS · Cloudflare

## Features

- Two-column layout with a sticky sidebar and section nav that tracks scrolling
- Cursor spotlight background and hover cards that dim their siblings
- Soft click "pop" sound (Web Audio, no asset) with a remembered mute toggle
- Pixel-art allay mascot with idle, hover and click reactions and section-aware speech bubbles
- Statically generated project deep-dive pages from a shared template
- Respects `prefers-reduced-motion`, keyboard accessible, mobile responsive

## Editing content

All content lives in `src/content/`. No layout code changes needed:

| File | What it holds |
|---|---|
| `profile.ts` | Name, tagline, About paragraphs (`**bold**` = highlighted), socials, resume path |
| `experience.ts` | Jobs, newest first |
| `projects.ts` | Featured projects + the deep-dive content for each `/projects/<slug>/` page |
| `education.ts` | Education, coursework, skills, and "Beyond the Code" tiles (add `image: "/images/beyond/<file>"` to make a tile flip to a photo) |
| `mascot.ts` | The mascot's speech-bubble lines |

Put your resume at `public/resume.pdf` and project screenshots at `public/images/projects/` (then set `image` on the project).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy (Cloudflare)

`npm run build` writes the static site to `out/`.

- **Workers (CLI):** `npm run deploy` (uses `wrangler.jsonc`, first run asks you to log in with `npx wrangler login`)
- **Pages (Git integration):** connect this repo in the Cloudflare dashboard with build command `npm run build` and output directory `out`

## Project structure

```
src/
  app/                 routes (home, /projects/[slug], 404)
  content/             all editable content + types
  components/
    layout/            SiteShell, Sidebar, Section, HoverGroup, CardShell
    cards/             ExperienceCard, ProjectCard, EducationCard, SkillGroups, BeyondTiles
    project/           ProjectLayout + deep-dive building blocks
    effects/           Spotlight, sound, scroll reveal, active-section tracking
    mascot/            Mascot behavior + placeholder sprite
    ui/                icons and small primitives (TechPill, MetricBadge, links)
docs/PLAN.md           design plan
```
