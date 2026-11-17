import type { BeyondItem } from "@/content/types";

export function BeyondTiles({ items }: { items: BeyondItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((b) => (
        <li key={b.title} className="rounded-lg border border-white/5 bg-bg-raised/50 p-4 transition hover:border-accent/30">
          <div className="text-2xl" aria-hidden>
            {b.icon}
          </div>
          <h3 className="mt-2 text-sm font-medium text-ink">{b.title}</h3>
          <p className="mt-1 text-sm leading-snug">{b.blurb}</p>
        </li>
      ))}
    </ul>
  );
}
