# Portfolio Website — Plan

> **Goal:** A clean, single-page, recruiter-friendly SWE portfolio that goes deep on projects, with a small amount of personality (a mascot + a click "pop"). Built to land FAANG interviews, not to win design awards.

---

## 1. Guiding principles

| Principle | What it means in practice |
|---|---|
| **Intuitive > impressive** | One scrolling page. No 3D, no hidden navigation, no "explore to find it." |
| **Projects are the star** | Every project has a short card on the home page **and** an in-depth page with links out. |
| **Personality in small doses** | Mascot in one corner, a soft pop sound on clicks, a cursor spotlight. That's it. |
| **Content lives in data files** | You fill in `.ts`/`.mdx` files; you never touch layout code to add a job or project. |
| **Fast + accessible** | Lighthouse 95+, works on mobile, keyboard-navigable, respects "reduce motion." |

**Inspiration and what we borrow:**
- **Brittany Chiang:** two-column layout, sticky left side, cursor spotlight background, hover cards that lift while siblings dim, one-page scroll.
- **Kalshi:** clean, confident, data-forward look; metrics shown as numbers; crisp type and plenty of whitespace.
- **Josh W. Comeau:** *only* the pop sound on button clicks.
- **Tristan's site:** mascot with a speech bubble, casual-but-professional voice.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Industry standard, and the site itself shows the skills you'd use at FAANG. |
| Styling | **Tailwind CSS** + CSS variables for theme tokens | Fast to build, easy to retheme. |
| Project write-ups | **MDX** (Markdown + components) | Write deep dives like a doc, and drop in diagrams, code and images. |
| Animation | CSS transitions + a little **Framer Motion** | Hover and entrance animations only. |
| Sound | Small `<audio>` helper (or `use-sound`) | Pop on click, with a mute toggle. |
| Hosting | **Vercel** + custom domain | Free, instant deploys from GitHub. |
| Analytics | Vercel Analytics (optional) | See which projects people open. |

---

## 3. Page layout (desktop)

```
┌──────────────────────────────┬───────────────────────────────────────┐
│  LEFT (sticky)               │  RIGHT (scrolls)                      │
│                              │                                       │
│  Your Name                   │  About                                │
│  Software Engineer           │  Experience                           │
│  one-line tagline            │  Projects (featured)                  │
│                              │  Education & Coursework               │
│  ── About                    │  Skills                               │
│  ── Experience  ◄ active     │  Beyond the Code (optional)           │
│  ── Projects                 │  Contact / Footer                     │
│  ── Education                │                                       │
│                              │                                       │
│  [Resume ↓]                  │                                       │
│  GitHub · LinkedIn · Email   │                                       │
│                              │                                       │
│  (mascot sits bottom-left)   │                                       │
└──────────────────────────────┴───────────────────────────────────────┘
        ↑ cursor spotlight glow follows the mouse across the whole page
```

**Mobile:** collapses to one column. The left side becomes a header at the top, the nav becomes section headings that stay pinned while you scroll, and the mascot shrinks to a small corner icon.

**Extra routes:**
- `/projects/[slug]`: an in-depth page for each project (template in §6).
- `/archive` (optional): a table of *all* projects (year, name, built-with, links), like Brittany's archive.
- `/resume.pdf`: a static file.

---

## 4. Sections (home page)

1. **About**: 2–3 short paragraphs on who you are, what you build and what you're looking for (e.g. "seeking SWE roles, new grad 20XX"). Keywords are highlighted in the accent color.
2. **Experience**: DraftKings, State Farm and the rest. Each card shows dates, title @ company, 2–3 impact bullets with numbers, and tech pills. The whole card links to the company or a write-up.
3. **Projects (featured, 3–5)**: thumbnail, name, one-line pitch, a key metric, tech pills, and GitHub/Live links. Clicking the card opens the deep-dive page. A "View all projects →" link goes to the archive.
4. **Education & Coursework**: school, degree, GPA (optional), graduation date, and relevant courses grouped by area (Systems, Algorithms, ML, …).
5. **Skills**: grouped rows (Languages / Frameworks / Data / Infra & Tools). Plain text pills, no "skill bars."
6. **Beyond the Code (optional, small)**: 2–3 tiles such as gym, Mario Kart, music. Kept to one short row so it doesn't compete with the work.
7. **Footer / Contact**: email, socials, "built with Next.js & Tailwind, deployed on Vercel" and a link to the site's repo.

---

## 5. Reusable widgets / templates

Every item below is one component, fed by data. To add a job or project, you add one entry to a data file.

### Layout and shell
| Component | Purpose | Key props / data |
|---|---|---|
| `SiteShell` | Two-column layout, mobile collapse | `children` |
| `SidebarIntro` | Name, title, tagline, resume button, socials | `profile` |
| `SectionNav` | Left nav that highlights the section you're in while scrolling | `sections[]` |
| `Section` | Wrapper with id, heading and spacing for each section | `id`, `title`, `children` |
| `Footer` | Contact, credits, repo link | `profile` |

### Content cards
| Component | Purpose | Key props / data |
|---|---|---|
| `ExperienceCard` | One job | `company, role, start, end, location, bullets[], tech[], url, logo?` |
| `ProjectCard` | One featured project on home | `slug, title, tagline, metric?, image, tech[], links{github, live, demo, devpost}` |
| `EducationCard` | School and degree | `school, degree, gradDate, gpa?, honors[]` |
| `CourseworkGroup` | Courses grouped by area | `area, courses[{code?, name, url?}]` |
| `SkillGroup` | One row of skill pills | `label, items[]` |
| `ArchiveTable` | Full list of projects | `projects[]` |
| `BeyondTile` (optional) | Small personal tile | `emoji/icon, title, blurb` |

### Small building blocks
| Component | Purpose |
|---|---|
| `TechPill` | Tag for one technology (consistent color/shape everywhere) |
| `IconLink` | GitHub / LinkedIn / Email / external-link icon buttons |
| `LinkButton` | Primary/secondary buttons (Resume, View project), with click pop built in |
| `MetricBadge` | Highlights a number, e.g. "↓ 78% listing time", the Kalshi-style data feel |
| `HoverGroup` | Wraps a list so hovering one card dims the others (Brittany effect) |

### Effects and personality
| Component | Purpose | Notes |
|---|---|---|
| `SpotlightBackground` | Soft radial glow that follows the cursor | Turned off on touch devices and with reduced motion |
| `SoundProvider` + `useClickSound()` | Plays the pop on button/link clicks | Low volume, **mute toggle** saved in the browser, never autoplays |
| `MuteToggle` | Small speaker icon in a corner | |
| `Mascot` | Your character (see §7) | Idle animation, hover reaction, speech bubble |
| `RevealOnScroll` | Subtle fade/slide-in as sections enter | Light, only once per section |

### Project deep-dive template
| Component | Purpose |
|---|---|
| `ProjectLayout` | Page template for `/projects/[slug]` (sections listed in §6) |
| `ProjectHero` | Title, tagline, role, timeline, team size, link buttons |
| `TechStackGrid` | Tech used, grouped by frontend/backend/infra |
| `ArchitectureDiagram` | Image or Mermaid diagram slot |
| `Callout` | "Key decision" / "What I'd do differently" boxes |
| `ImageGallery` | Screenshots with captions |
| `ResultsStats` | Row of `MetricBadge`s |

---

## 6. Project deep-dive page (template)

Each project is one `.mdx` file. Every page follows the same outline, so recruiters always know where to look:

1. **Hero:** name, one-line pitch, your role, dates, team size, buttons (GitHub · Live · Demo video · Devpost).
2. **TL;DR:** 3 bullets: what it is, what you built, the result.
3. **Problem:** why it exists and who it's for.
4. **Architecture:** a diagram plus a short walkthrough (FAANG interviewers love this).
5. **Tech stack:** grouped, with *why* you picked each piece.
6. **Hard parts / key decisions:** 2–3 technical challenges and how you solved them (scaling, latency, data modeling, …).
7. **Results:** numbers (users, latency, % improvements, awards).
8. **What I'd do next:** shows engineering maturity.
9. **Screenshots / demo.**
10. **← Back to all projects**, plus a link to the next project.

---

## 7. Mascot: inspired by Bowser Jr.

**Legal note:** Bowser Jr. is Nintendo's trademarked character, and Nintendo actively enforces its IP. Using official art or sprites (or a close copy) on a public site, especially one tied to your professional brand, is a real risk. **The plan is an *original* character with the same energy:** a small, cocky, spiky-shelled dino/turtle kid with a bandana bib, made as our own pixel art. It reads as "Bowser Jr. vibes" without being him.

**Behavior (kept subtle):**
- Lives bottom-left of the sidebar (or bottom-right on mobile), about 64–96px.
- **Idle:** slow 2–4 frame breathing/bobbing loop.
- **Hover:** looks toward the cursor or does a small hop.
- **Click:** pop sound, a short emote (flex, fire-breath puff, thumbs-up) and a speech bubble with a rotating line:
  - "currently: shipping at DraftKings 🏁"
  - "ask me about [project]!"
  - "PR'd today 💪"
- **Section-aware (optional):** the line changes based on the section you're viewing ("these are my favorite projects →").
- Lines live in a data file, so you can edit them.
- Hidden with reduced motion? No: it stays, but stops animating.

**Assets needed:** one sprite sheet (idle, hover, 2–3 emotes) as PNG or SVG. Options: draw it in Aseprite/Piskel, commission it, or I build a simple SVG/pixel version as a placeholder.

---

## 8. Visual style

| Token | Proposal | Notes |
|---|---|---|
| Background | Deep navy/near-black (`#0b1020`-ish) | Brittany-like, works with the spotlight |
| Text | Off-white primary, slate-gray secondary | |
| **Accent** | **Pick one:** Kalshi-style teal/green, *or* gym-neon red (fits the mascot) | Used for links, active nav, metrics, highlights |
| Font | Clean sans for body (Inter / Geist); optional mono for small labels, dates and tech pills (JetBrains Mono / Geist Mono) | A small nod to your retro-tech interest without overdoing it |
| Motion | 150–250ms ease-out; nothing bouncy except the mascot | |

---

## 9. Content files you'll fill in

```
/content
  profile.ts        → name, title, tagline, about paragraphs, email, socials, resume path
  experience.ts     → array of jobs (DraftKings, State Farm, …)
  projects.ts       → featured project metadata (for cards + archive)
  projects/*.mdx    → one deep-dive file per project
  education.ts      → school, degree, coursework groups
  skills.ts         → grouped skill lists
  beyond.ts         → optional personal tiles
  mascot.ts         → speech-bubble lines, section-specific lines
/public
  resume.pdf
  images/projects/*
  mascot/*.png|svg
  sounds/pop.mp3
```

Every field you haven't filled in shows as a clear `TODO` placeholder, so the site still builds while you add content.

---

## 10. Quality bar

- **Performance:** Lighthouse ≥ 95 on all four categories; images optimized; sound and mascot load after the page.
- **Accessibility:** semantic headings, visible focus states, alt text, color contrast AA, reduced-motion support, sound off-switch.
- **SEO / sharing:** page titles and descriptions, an Open Graph preview image (name + title + mascot), sitemap.
- **Mobile:** tested at 375px wide, with no sideways scrolling.

---

## 11. Build order

1. **Skeleton:** Next.js + Tailwind setup, `SiteShell`, `Section`, `SectionNav`, data files with placeholder content.
2. **Core content:** `ExperienceCard`, `ProjectCard`, `EducationCard`, `SkillGroup`, `TechPill`, `IconLink`.
3. **Project deep dives:** MDX setup, `ProjectLayout` and one fully worked example page.
4. **Polish:** `SpotlightBackground`, `HoverGroup` dimming, `RevealOnScroll`, click pop + `MuteToggle`.
5. **Mascot:** placeholder art, idle/hover/click behavior, speech bubble.
6. **Extras:** `/archive`, OG image, analytics, deploy to Vercel + custom domain.

---

## 12. Open questions for you

1. **Accent color:** Kalshi-style teal/green, or gym-neon red?
2. **Mascot art:** do you want to draw or commission it, or should I make a placeholder you can replace later?
3. **"Beyond the Code" section:** include it (gym / Mario Kart / music), or keep the site 100% professional?
4. **Pop sound:** on by default (with mute) or off by default (with unmute)?
5. **Domain:** do you already own one (e.g. `yourname.com`)?
6. **Archive page:** worth it, or are featured projects enough?
