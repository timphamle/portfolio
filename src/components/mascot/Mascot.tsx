"use client";

import { useEffect, useRef, useState } from "react";
import { mascotLines, mascotName } from "@/content/mascot";
import { useActiveSection } from "@/components/effects/ActiveSection";
import { MascotSprite } from "./MascotSprite";

/**
 * Idle: gentle bob. Hover: hop. Click: pop sound (via SoundProvider), happy face,
 * and the next line in the speech bubble. Scrolling into a section shows that section's line.
 */
export function Mascot({ size = 72 }: { size?: number }) {
  const section = useActiveSection();
  const [line, setLine] = useState<string | null>(null);
  const [hop, setHop] = useState(false);
  const [happy, setHappy] = useState(false);
  const index = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSection = useRef<string | null>(null);

  const say = (text: string, ms = 3500) => {
    setLine(text);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setLine(null), ms);
  };

  const doHop = () => {
    setHop(false);
    requestAnimationFrame(() => setHop(true));
  };

  // React to the section in view (stay quiet on the first one at page load).
  useEffect(() => {
    if (!section) return;
    if (lastSection.current === null) {
      lastSection.current = section;
      return;
    }
    if (section === lastSection.current) return;
    lastSection.current = section;
    const text = mascotLines.sections[section];
    if (text) say(text, 2800);
  }, [section]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const onClick = () => {
    say(mascotLines.general[index.current % mascotLines.general.length]);
    index.current += 1;
    setHappy(true);
    doHop();
    setTimeout(() => setHappy(false), 700);
  };

  return (
    <div className="relative inline-flex flex-col items-start">
      <div aria-live="polite" className="pointer-events-none absolute bottom-full left-0 mb-2 w-max max-w-[220px]">
        {line && (
          <div
            key={line}
            className="animate-bubble relative rounded-xl border border-white/10 bg-bg-raised px-3 py-2 text-xs leading-snug text-ink shadow-lg"
          >
            {line}
            <span className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-bg-raised" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={doHop}
        onAnimationEnd={() => setHop(false)}
        aria-label={`${mascotName}, Tim's mascot. Click to say hi.`}
        className={`cursor-pointer rounded-lg ${hop ? "animate-hop" : "animate-bob"}`}
      >
        <MascotSprite size={size} happy={happy} />
      </button>
    </div>
  );
}
