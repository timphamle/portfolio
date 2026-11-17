// Shared shapes for every content file. Add a job / project / course by adding
// one object to the matching array — no layout code changes needed.

export type LinkKind = "github" | "live" | "video" | "devpost" | "docs" | "external";

export interface ProjectLink {
  kind: LinkKind;
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  /** Paragraphs for the About section. Wrap words in **double stars** to highlight them. */
  about: string[];
  email: string;
  socials: { github: string; linkedin: string };
  /** Path under /public. Leave empty ("") to hide the resume button. */
  resumePath: string;
  siteUrl: string;
}

export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  url?: string;
  bullets: string[];
  tech: string[];
}

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  /** One headline number shown on the card. */
  metric?: Metric;
  /** Small ribbon like "1st Place · HackDuke 2025". */
  award?: string;
  tech: string[];
  links: ProjectLink[];
  /** Optional image under /public (e.g. "/images/projects/mygymbro.png"). */
  image?: string;
  /** Deep-dive page content. */
  detail: ProjectDetail;
}

export interface ProjectDetail {
  role: string;
  team: string;
  tldr: string[];
  problem: string[];
  /** Ordered steps describing how data/requests flow through the system. */
  architecture: { step: string; detail: string }[];
  stack: { group: string; items: { name: string; why: string }[] }[];
  challenges: { title: string; body: string }[];
  results: Metric[];
  next: string[];
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  grad: string;
  gpa?: string;
  coursework: { area: string; courses: string[] }[];
  activities: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface BeyondItem {
  icon: string;
  title: string;
  blurb: string;
}
