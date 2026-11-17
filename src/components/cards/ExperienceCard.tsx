import type { Experience } from "@/content/types";
import { CardShell } from "@/components/layout/Section";
import { TechList } from "@/components/ui/primitives";
import { ArrowUpRight } from "@/components/ui/icons";

export function ExperienceCard({ job }: { job: Experience }) {
  const title = (
    <>
      {job.role} · <span className="inline-block">{job.company}</span>
    </>
  );

  return (
    <CardShell>
      <header className="z-10 mt-1 mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-faint sm:col-span-2">
        {job.start} — {job.end}
      </header>
      <div className="z-10 sm:col-span-6">
        <h3 className="font-medium leading-snug text-ink">
          {job.url ? (
            <a href={job.url} target="_blank" rel="noreferrer noopener" className="group/link inline-flex items-baseline text-base hover:text-accent focus-visible:text-accent">
              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
              <span>{title}</span>
              <ArrowUpRight className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-0.5 text-sm text-faint">{job.location}</p>
        <ul className="mt-2 list-none space-y-1.5 text-sm leading-normal">
          {job.bullets.map((b) => (
            <li key={b} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-accent/70">
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <TechList items={job.tech} />
        </div>
      </div>
    </CardShell>
  );
}
