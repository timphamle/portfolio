"use client";

import { useState } from "react";
import type { BeyondItem } from "@/content/types";

const face = "rounded-lg border border-white/5 bg-bg-raised/50 p-4";

export function BeyondTiles({ items }: { items: BeyondItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((b) => (
        <li key={b.title}>
          <BeyondCard item={b} />
        </li>
      ))}
    </ul>
  );
}

function Front({ item }: { item: BeyondItem }) {
  return (
    <>
      <div className="text-2xl" aria-hidden>
        {item.icon}
      </div>
      <h3 className="mt-2 text-sm font-medium text-ink">{item.title}</h3>
      <p className="mt-1 text-sm leading-snug">{item.blurb}</p>
    </>
  );
}

/** A Beyond tile. With an `image`, clicking flips it over to show the photo. */
export function BeyondCard({ item }: { item: BeyondItem }) {
  const [flipped, setFlipped] = useState(false);

  if (!item.image) {
    return (
      <div className={`${face} h-full transition hover:border-accent/30`}>
        <Front item={item} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      data-flipped={flipped}
      className="flip group block h-full w-full rounded-lg text-left"
    >
      <span className="sr-only">{flipped ? "Flip back to text" : "Flip to see photo"}</span>
      <div className="flip-inner h-full">
        <div className={`${face} relative transition group-hover:border-accent/30`} aria-hidden={flipped}>
          <Front item={item} />
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[11px] text-faint transition lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
            flip ↻
          </span>
        </div>
        <div className="flip-back relative overflow-hidden rounded-lg border border-accent/30 bg-bg-raised" aria-hidden={!flipped}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.imageAlt ?? item.title} loading="lazy" style={{ objectPosition: item.imagePosition }} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-6 text-xs font-medium text-white">
            <span>{item.title}</span>
            <span className="font-mono text-[11px] text-white/70">↺</span>
          </div>
        </div>
      </div>
    </button>
  );
}
