import type { Metric, ProjectLink } from "@/content/types";
import { LinkKindIcon } from "./icons";

/** One technology tag. Used everywhere tech is listed so they all match. */
export function TechPill({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium leading-5 text-accent">{children}</li>
  );
}

export function TechList({ items, label = "Technologies used" }: { items: string[]; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((t) => (
        <TechPill key={t}>{t}</TechPill>
      ))}
    </ul>
  );
}

/** A highlighted number, Kalshi-style. */
export function MetricBadge({ metric, size = "sm" }: { metric: Metric; size?: "sm" | "lg" }) {
  if (size === "lg") {
    return (
      <div className="rounded-xl border border-white/5 bg-bg-raised/60 p-4">
        <div className="font-mono text-2xl font-semibold text-shell">{metric.value}</div>
        <div className="mt-1 text-sm text-muted">{metric.label}</div>
      </div>
    );
  }
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-md bg-shell-soft px-2 py-0.5 text-xs">
      <span className="font-mono font-semibold text-shell">{metric.value}</span>
      <span className="text-muted">{metric.label}</span>
    </span>
  );
}

/** External link with an icon that matches what it points to (GitHub, video, docs, live site). */
export function ExternalLink({ link, className = "" }: { link: ProjectLink; className?: string }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      className={`relative z-20 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition hover:text-accent ${className}`}
    >
      <LinkKindIcon kind={link.kind} />
      {link.label}
    </a>
  );
}

/** Renders **bold** segments in content strings as highlighted text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span key={i} className="font-medium text-ink">
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
