# timphamle.com

My personal portfolio: a single-page, scroll-through site covering my experience, projects, education and a bit about me, with an in-depth page for every project.

**Stack:** Next.js (App Router, static export) · TypeScript · Tailwind CSS · Cloudflare

## Features

- Two-column layout with a sticky sidebar and section nav that tracks scrolling
- Cursor spotlight background and hover cards that dim their siblings
- Soft click "pop" sound (Web Audio, no asset) with a remembered mute toggle
- A pixel-art allay mascot that flies a fixed path in the left column as you scroll, comments on each section, shares a current update, and can be clicked for more lines (path in `src/components/mascot/FlyingAllay.tsx`)
- 3D interactive skills graph (drag to rotate, hover to see connections)
- Statically generated project deep-dive pages from a shared template
- Respects `prefers-reduced-motion`, keyboard accessible, mobile responsive

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

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
    mascot/            FlyingAllay (scroll-driven flight path)
    skills/            SkillGraph (3D canvas graph)
    ui/                icons and small primitives (TechPill, MetricBadge, links)
docs/PLAN.md           design plan
```
