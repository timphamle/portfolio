import Link from "next/link";
import type { Project } from "@/content/types";
import { CardShell } from "@/components/layout/Section";
import { ExternalLink, MetricBadge, TechList } from "@/components/ui/primitives";
import { ArrowRight } from "@/components/ui/icons";

/** Featured project on the home page. The whole card opens the deep-dive page; link row goes out. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <CardShell>
      <div className="z-10 sm:order-2 sm:col-span-6">
        <h3>
          <Link
            href={`/projects/${project.slug}/`}
            className="group/link inline-flex items-baseline text-base font-medium leading-tight text-ink hover:text-accent focus-visible:text-accent"
          >
            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
            <span>{project.title}</span>
            <ArrowRight className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1" />
          </Link>
        </h3>
        {project.award && <p className="mt-1 text-xs font-semibold text-accent">🏆 {project.award}</p>}
        <p className="mt-2 text-sm leading-normal">{project.tagline}</p>
        {project.metric && (
          <div className="mt-2">
            <MetricBadge metric={project.metric} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {project.links.slice(0, 3).map((l) => (
            <ExternalLink key={l.href} link={l} />
          ))}
        </div>
        <div className="mt-3">
          <TechList items={project.tech} />
        </div>
      </div>
      <ProjectThumb project={project} />
    </CardShell>
  );
}

/** Screenshot if provided, otherwise a generated placeholder tile. */
function ProjectThumb({ project }: { project: Project }) {
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className="z-10 aspect-video w-full rounded border-2 border-white/10 object-cover transition group-hover:border-white/30 sm:order-1 sm:col-span-2 sm:translate-y-1"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="z-10 flex aspect-video w-full items-center justify-center rounded border-2 border-white/10 bg-gradient-to-br from-bg-raised to-[#16233f] font-mono text-lg font-semibold text-accent/80 transition group-hover:border-white/30 sm:order-1 sm:col-span-2 sm:translate-y-1"
    >
      {project.title
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 3)}
    </div>
  );
}
