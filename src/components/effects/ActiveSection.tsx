"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** Tracks which home-page section is currently in view (for the nav and the mascot). */
const Ctx = createContext<string>("");
export const useActiveSection = () => useContext(Ctx);

export function ActiveSectionProvider({ ids, children }: { ids: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return <Ctx.Provider value={active}>{children}</Ctx.Provider>;
}
