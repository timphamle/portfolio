import Link from "next/link";
import type { Project } from "@/content/types";
import { ExternalLink, MetricBadge, TechList } from "@/components/ui/primitives";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

/**
 * Deep-dive template used by every /projects/<slug>/ page.
 * Every project follows the same outline so readers always know where to look.
 */
export function ProjectLayout({ project, next }: { project: Project; next?: Project }) {
  const d = project.detail;
  return (
    <div className="relative z-10 mx-auto min-h-screen max-w-3xl px-6 py-12 md:px-12 md:py-20">
      <Link href="/#projects" className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-accent">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Tim Le
      </Link>

      <ProjectHero project={project} />

      <Block title="TL;DR">
        <Bullets items={d.tldr} />
      </Block>

      <Block title="The problem">
        <div className="space-y-3">
          {d.problem.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Block>

      <Block title="How it works">
        <ArchitectureFlow steps={d.architecture} />
      </Block>

      <Block title="Tech stack & why">
        <TechStackGrid stack={d.stack} />
      </Block>

      <Block title="Hard parts & key decisions">
        <div className="space-y-4">
          {d.challenges.map((c) => (
            <Callout key={c.title} title={c.title}>
              {c.body}
            </Callout>
          ))}
        </div>
      </Block>

      <Block title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {d.results.map((m) => (
            <MetricBadge key={m.label} metric={m} size="lg" />
          ))}
        </div>
      </Block>

      <Block title="What I'd do next">
        <Bullets items={d.next} />
      </Block>

      <nav className="mt-16 flex items-center justify-between border-t border-white/10 pt-8 text-sm font-semibold">
        <Link href="/#projects" className="group inline-flex items-center gap-2 text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All projects
        </Link>
        {next && (
          <Link href={`/projects/${next.slug}/`} className="group inline-flex items-center gap-2 text-accent">
            {next.title}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </nav>
    </div>
  );
}

export function ProjectHero({ project }: { project: Project }) {
  const d = project.detail;
  return (
    <header className="mb-12">
      {project.award && <p className="mb-2 text-sm font-semibold text-accent">🏆 {project.award}</p>}
      <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg leading-relaxed">{project.tagline}</p>
      <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-white/10 py-4 text-sm">
        <Meta label="Role" value={d.role} />
        <Meta label="Timeline" value={project.date} />
        <Meta label="Team" value={d.team === "1" ? "Solo" : `${d.team} people`} />
      </dl>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {project.links.map((l) => (
          <ExternalLink key={l.href} link={l} />
        ))}
      </div>
      <div className="mt-5">
        <TechList items={project.tech} />
      </div>
    </header>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-faint">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Numbered pipeline: how a request / data moves through the system. */
export function ArchitectureFlow({ steps }: { steps: { step: string; detail: string }[] }) {
  return (
    <ol className="relative space-y-5 border-l border-white/10 pl-6">
      {steps.map((s, i) => (
        <li key={s.step} className="relative">
          <span className="absolute -left-[2.15rem] flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-bg font-mono text-xs text-accent">
            {i + 1}
          </span>
          <h3 className="font-medium text-ink">{s.step}</h3>
          <p className="mt-0.5 text-sm">{s.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function TechStackGrid({ stack }: { stack: Project["detail"]["stack"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stack.map((g) => (
        <div key={g.group} className="rounded-lg border border-white/5 bg-bg-raised/50 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">{g.group}</h3>
          <ul className="space-y-2.5">
            {g.items.map((it) => (
              <li key={it.name} className="text-sm">
                <span className="font-mono font-medium text-accent">{it.name}</span>
                <span className="block text-muted">{it.why}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-2 border-shell bg-shell-soft/50 p-4">
      <h3 className="font-medium text-ink">{title}</h3>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  );
}
