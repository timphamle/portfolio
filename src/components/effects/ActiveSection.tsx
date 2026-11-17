"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** Tracks which home-page section is currently in view (for the nav). */
const Ctx = createContext<string>("");
export const useActiveSection = () => useContext(Ctx);

export function ActiveSectionProvider({ ids, children }: { ids: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    // The last section is often too short to reach the trigger band, so the very
    // bottom of the page always counts as the last section.
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const observer = new IntersectionObserver(
      (entries) => {
        if (atBottom()) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    let wasBottom = false;
    const onScroll = () => {
      const bottom = atBottom();
      if (bottom && !wasBottom && ids.length) setActive(ids[ids.length - 1]);
      if (!bottom && wasBottom) {
        // Leaving the bottom: fall back to whichever section is in the trigger band.
        const band = window.innerHeight * 0.3;
        const current = [...els].reverse().find((el) => el.getBoundingClientRect().top <= band);
        if (current) setActive(current.id);
      }
      wasBottom = bottom;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return <Ctx.Provider value={active}>{children}</Ctx.Provider>;
}
