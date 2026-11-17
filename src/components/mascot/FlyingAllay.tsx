"use client";

import { useEffect, useRef, useState } from "react";
import { activeUpdate, mascotLines } from "@/content/mascot";
import { useActiveSection } from "@/components/effects/ActiveSection";
import { AllaySprite } from "./AllaySprite";

/**
 * The allay flies along a fixed path in the LEFT column as the page scrolls, always
 * facing right, as if it is watching the content and commenting on it.
 *
 * On desktop it flies in front of the page and is clickable (hover = grow + glow, click =
 * hop, sparkles and the next line); its route only uses empty space, so it never covers
 * text. On phones it flies behind the page instead, since its route crosses text there.
 * Lines come from src/content/mascot.ts (current update, general lines, section lines).
 *
 * The path is a list of waypoints keyed to scroll progress (0 = top of page,
 * 1 = bottom). Each waypoint points at a zone of the layout, so the route adapts to
 * any screen size:
 *
 *   name   beside your name (where the allay starts)
 *   lane   the empty strip in the sidebar between your intro/nav and the content
 *   band   the empty space in the sidebar between the nav and the social icons
 *   edge   the left screen edge (phones, where there is no sidebar)
 *
 * fx / fy are 0-1 positions inside the zone (fy is a fraction of the screen height
 * for lane and edge).
 */
type Zone = "name" | "lane" | "band" | "edge";
type Waypoint = { p: number; zone: Zone; fx?: number; fy?: number };

const DESKTOP_PATH: Waypoint[] = [
  { p: 0.0, zone: "name" },
  { p: 0.08, zone: "lane", fx: 0.5, fy: 0.3 },
  { p: 0.18, zone: "lane", fx: 0.3, fy: 0.55 },
  { p: 0.28, zone: "band", fx: 0.35, fy: 0.5 },
  { p: 0.38, zone: "lane", fx: 0.6, fy: 0.72 },
  { p: 0.48, zone: "lane", fx: 0.4, fy: 0.38 },
  { p: 0.58, zone: "band", fx: 0.7, fy: 0.3 },
  { p: 0.68, zone: "lane", fx: 0.5, fy: 0.6 },
  { p: 0.78, zone: "lane", fx: 0.7, fy: 0.25 },
  { p: 0.88, zone: "band", fx: 0.5, fy: 0.7 },
  { p: 1.0, zone: "lane", fx: 0.5, fy: 0.5 },
];

const MOBILE_PATH: Waypoint[] = [
  { p: 0.0, zone: "name" },
  { p: 0.08, zone: "edge", fy: 0.25 },
  { p: 0.22, zone: "edge", fy: 0.62 },
  { p: 0.36, zone: "edge", fy: 0.38 },
  { p: 0.5, zone: "edge", fy: 0.75 },
  { p: 0.64, zone: "edge", fy: 0.3 },
  { p: 0.78, zone: "edge", fy: 0.65 },
  { p: 0.9, zone: "edge", fy: 0.4 },
  { p: 1.0, zone: "edge", fy: 0.55 },
];

const SIZE_DESKTOP = 64;
const SIZE_MOBILE = 44;
const SPARKS = 18;
/** Show a general line after the reader has stopped scrolling this long (ms). */
const IDLE_CHAT_MS = 18000;

type Vec = { x: number; y: number };

function rect(sel: string) {
  return document.querySelector(sel)?.getBoundingClientRect() ?? null;
}

/** Horizontal range of the empty lane: right of the intro text and nav, left of the content. */
function lane(size: number) {
  const side = rect('[data-allay="sidebar"]');
  if (!side) return null;
  const textRight = Math.max(
    rect('[data-allay="tagline"]')?.right ?? side.left,
    rect('[data-allay="nav"]')?.right ?? side.left,
    rect('[data-allay="name"]')?.right ?? side.left,
  );
  const right = side.right - size * 0.5;
  const left = Math.min(right, textRight + size * 0.6);
  return { left, right };
}

function resolve(w: Waypoint, desktop: boolean, size: number): Vec {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fx = w.fx ?? 0.5;
  const fy = w.fy ?? 0.5;

  switch (w.zone) {
    case "name": {
      const name = rect('[data-allay="name"]');
      if (name) return { x: name.right + (desktop ? 32 : 20) + size / 2, y: name.top + name.height / 2 };
      return { x: vw * 0.3, y: vh * 0.15 };
    }
    case "lane": {
      const l = lane(size);
      if (l) return { x: l.left + fx * (l.right - l.left), y: size + fy * (vh - 2 * size) };
      return { x: vw * 0.4, y: vh * fy };
    }
    case "band": {
      const side = rect('[data-allay="sidebar"]');
      const nav = rect('[data-allay="nav"]');
      const socials = rect('[data-allay="socials"]');
      if (side && nav && socials) {
        const top = nav.bottom + size * 0.6;
        const bottom = Math.max(top, socials.top - size * 0.6);
        return { x: side.left + size / 2 + fx * (side.width - size), y: top + fy * (bottom - top) };
      }
      return { x: vw * 0.25, y: vh * fy };
    }
    case "edge":
      return { x: size / 2 + 6, y: vh * fy };
  }
}

type Side = "above" | "below" | "left" | "right";
type Box = { x: number; y: number; w: number; h: number };

function overlap(a: Box, b: DOMRect | null) {
  if (!b) return 0;
  const w = Math.min(a.x + a.w, b.right) - Math.max(a.x, b.left);
  const h = Math.min(a.y + a.h, b.bottom) - Math.max(a.y, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}

/**
 * Put the speech bubble on whichever side of the allay covers the least page text
 * (the content column, the sidebar intro and the social icons). Sticks with the
 * current side unless another one is clearly better, so it does not jitter.
 */
function placeBubble(el: HTMLElement, at: Vec, size: number, current: Side, maxRight: number): Side {
  const bw = el.offsetWidth;
  const bh = el.offsetHeight;
  const gap = 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const text = [
    document.querySelector("#content")?.getBoundingClientRect() ?? null,
    document.querySelector('[data-allay="intro"]')?.getBoundingClientRect() ?? null,
    document.querySelector('[data-allay="socials"]')?.getBoundingClientRect() ?? null,
  ];
  const boxFor = (side: Side): Box => {
    let x = at.x - bw / 2;
    let y = at.y - size / 2 - gap - bh;
    if (side === "below") y = at.y + size / 2 + gap;
    if (side === "left") {
      x = at.x - size / 2 - gap - bw;
      y = at.y - bh / 2;
    }
    if (side === "right") {
      x = at.x + size / 2 + gap;
      y = at.y - bh / 2;
    }
    return { x: Math.max(8, Math.min(Math.min(vw, maxRight) - bw - 8, x)), y: Math.min(vh - bh - 8, Math.max(8, y)), w: bw, h: bh };
  };
  const score = (side: Side) => text.reduce((sum, r) => sum + overlap(boxFor(side), r), 0);
  let best = current;
  let bestScore = score(current);
  for (const side of ["above", "below", "left", "right"] as Side[]) {
    const sc = score(side);
    if (sc < bestScore * 0.8 - 1) {
      best = side;
      bestScore = sc;
    }
  }
  const b = boxFor(best);
  el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
  return best;
}

/** Catmull-Rom spline through the resolved waypoints. */
function pointOnPath(path: Waypoint[], p: number, desktop: boolean, size: number): Vec {
  let i = path.findIndex((w, k) => k < path.length - 1 && p <= path[k + 1].p);
  if (i < 0) i = path.length - 2;
  const a = path[i];
  const b = path[i + 1];
  const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p || 1)));
  const p0 = resolve(path[Math.max(0, i - 1)], desktop, size);
  const p1 = resolve(a, desktop, size);
  const p2 = resolve(b, desktop, size);
  const p3 = resolve(path[Math.min(path.length - 1, i + 2)], desktop, size);
  const cr = (q0: number, q1: number, q2: number, q3: number) =>
    0.5 * (2 * q1 + (-q0 + q2) * t + (2 * q0 - 5 * q1 + 4 * q2 - q3) * t * t + (-q0 + 3 * q1 - 3 * q2 + q3) * t * t * t);
  return { x: cr(p0.x, p1.x, p2.x, p3.x), y: cr(p0.y, p1.y, p2.y, p3.y) };
}

export function FlyingAllay() {
  const birdRef = useRef<HTMLDivElement>(null);
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ text: string; id: number } | null>(null);
  const section = useActiveSection();
  const lastSection = useRef<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chatIndex = useRef(0);
  const showing = useRef(false);
  const burst = useRef(false);
  const [hop, setHop] = useState(false);

  /** Lines for greeting, clicks and idle chatter: the current update (if any), then the general lines. */
  const chatLines = () => {
    const update = activeUpdate();
    return update ? [update, ...mascotLines.general] : mascotLines.general;
  };
  const sayNext = () => {
    const lines = chatLines();
    const text = lines[chatIndex.current % lines.length];
    chatIndex.current += 1;
    say(text, text === activeUpdate() ? 5000 : 3500);
  };
  // Effects below call the latest sayNext through this ref.
  const sayNextRef = useRef(sayNext);
  sayNextRef.current = sayNext;
  const doHop = () => {
    setHop(false);
    requestAnimationFrame(() => setHop(true));
  };
  const onClick = () => {
    sayNext();
    doHop();
    burst.current = true;
  };

  const say = (text: string, ms = 3200) => {
    showing.current = true;
    setLine({ text, id: Date.now() });
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      showing.current = false;
      setLine(null);
    }, ms);
  };

  // Greeting shortly after the page loads.
  useEffect(() => {
    const t = setTimeout(() => sayNextRef.current(), 1200);
    return () => {
      clearTimeout(t);
      clearTimeout(hideTimer.current);
    };
  }, []);

  // A line for each section as it scrolls into view (quiet for the first one).
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

  // When the reader pauses, chime in with the next general line.
  useEffect(() => {
    let lastScroll = Date.now();
    const onScroll = () => {
      lastScroll = Date.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setInterval(() => {
      if (showing.current || Date.now() - lastScroll < IDLE_CHAT_MS) return;
      sayNextRef.current();
      lastScroll = Date.now();
    }, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const bird = birdRef.current;
    if (!bird) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lg = window.matchMedia("(min-width: 1024px)");

    const pos: Vec = { x: NaN, y: NaN };
    const vel: Vec = { x: 0, y: 0 };
    let fast = false;
    let tilt = 0;
    let last = performance.now();
    let sparkTimer = 0;
    let nextSpark = 0;
    const sparks = Array.from({ length: SPARKS }, () => ({ x: 0, y: 0, life: 0, max: 1, dx: 0, s: 4 }));
    let frame = 0;
    let side: Side = "above";

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const desktop = lg.matches;
      const size = desktop ? SIZE_DESKTOP : SIZE_MOBILE;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      let target = reduced
        ? resolve({ p: 0, zone: "name" }, desktop, size)
        : pointOnPath(desktop ? DESKTOP_PATH : MOBILE_PATH, progress, desktop, size);
      const column = desktop ? rect('[data-allay="sidebar"]') : null;
      const maxX = column ? column.right - size / 2 : window.innerWidth - size / 2 - 4;
      target = {
        x: Math.min(maxX, Math.max(size / 2 + 4, target.x)),
        y: Math.min(window.innerHeight - size / 2 - 4, Math.max(size / 2 + 4, target.y)),
      };

      if (Number.isNaN(pos.x) || reduced) {
        pos.x = target.x;
        pos.y = target.y;
      } else {
        const k = 1 - Math.exp(-dt * 5);
        const nx = pos.x + (target.x - pos.x) * k;
        const ny = pos.y + (target.y - pos.y) * k;
        vel.x = (nx - pos.x) / (dt || 1 / 60);
        vel.y = (ny - pos.y) / (dt || 1 / 60);
        pos.x = nx;
        pos.y = ny;
      }

      const t = now / 1000;
      const speed = Math.hypot(vel.x, vel.y);
      // The artwork faces left; mirror it so the allay always looks at the content.
      const facing = -1;
      const wantTilt = reduced ? 0 : Math.max(-16, Math.min(16, vel.x * 0.025)) + Math.sin(t * 1.3) * 3;
      tilt += (wantTilt - tilt) * Math.min(1, dt * 8);
      const bob = reduced ? 0 : Math.sin(t * 2.6) * 5;
      // Wings beat faster while flying, slower while hovering in place.
      if (speed > 90 && !fast) {
        fast = true;
        bird.style.setProperty("--flap", "0.3s");
      } else if (speed < 25 && fast) {
        fast = false;
        bird.style.setProperty("--flap", "0.6s");
      }

      bird.style.width = `${size}px`;
      bird.style.height = `${size}px`;
      bird.style.opacity = desktop ? "1" : "0.85";
      bird.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2 + bob}px, 0) rotate(${tilt}deg) scale(${facing}, 1)`;

      const bubble = bubbleRef.current;
      if (bubble && bubble.firstElementChild) side = placeBubble(bubble, { x: pos.x, y: pos.y + bob }, size, side, column ? column.right + 8 : window.innerWidth);

      // Sparkle trail while moving, plus a burst when clicked.
      if (!reduced) {
        if (burst.current) {
          burst.current = false;
          for (let k = 0; k < 10; k++) {
            const s = sparks[nextSpark];
            nextSpark = (nextSpark + 1) % SPARKS;
            const a = (k / 10) * Math.PI * 2;
            s.x = pos.x + Math.cos(a) * size * 0.45;
            s.y = pos.y + bob + Math.sin(a) * size * 0.45;
            s.dx = Math.cos(a) * 26;
            s.max = 0.7 + Math.random() * 0.3;
            s.life = s.max;
            s.s = 3 + Math.round(Math.random() * 3);
          }
        }
        sparkTimer += dt;
        if (speed > 60 && sparkTimer > 0.045) {
          sparkTimer = 0;
          const s = sparks[nextSpark];
          nextSpark = (nextSpark + 1) % SPARKS;
          const back = speed > 0 ? { x: -vel.x / speed, y: -vel.y / speed } : { x: 0, y: 0 };
          s.x = pos.x + back.x * size * 0.35 + (Math.random() - 0.5) * size * 0.4;
          s.y = pos.y + bob + back.y * size * 0.35 + (Math.random() - 0.5) * size * 0.4;
          s.dx = (Math.random() - 0.5) * 14;
          s.max = 0.6 + Math.random() * 0.4;
          s.life = s.max;
          s.s = 3 + Math.round(Math.random() * 3);
        }
        sparks.forEach((s, i) => {
          const el = sparkRefs.current[i];
          if (!el) return;
          if (s.life <= 0) {
            el.style.opacity = "0";
            return;
          }
          s.life -= dt;
          const f = Math.max(0, s.life / s.max);
          el.style.opacity = String(f * 0.9);
          el.style.width = el.style.height = `${s.s}px`;
          el.style.transform = `translate3d(${s.x + s.dx * (1 - f)}px, ${s.y + 14 * (1 - f)}px, 0)`;
        });
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {/* Behind the page on phones (its route crosses text there); in front and clickable on
          desktop, where it only flies through empty space in the left column. */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden lg:z-20">
        {Array.from({ length: SPARKS }, (_, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              sparkRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 bg-[#a8e8ff] opacity-0 shadow-[0_0_6px_rgba(92,194,242,0.9)]"
          />
        ))}
        <div ref={birdRef} className="absolute left-0 top-0 opacity-0 will-change-transform lg:pointer-events-auto" style={{ width: SIZE_DESKTOP, height: SIZE_DESKTOP }}>
          <button
            type="button"
            onClick={onClick}
            onMouseEnter={doHop}
            onAnimationEnd={() => setHop(false)}
            aria-label="Allay, Tim's mascot. Click for a message."
            className={`group block h-full w-full cursor-pointer rounded-lg ${hop ? "animate-hop" : ""}`}
          >
            <AllaySprite
              size={SIZE_DESKTOP}
              className="h-full w-full drop-shadow-[0_0_10px_rgba(92,194,242,0.55)] transition duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(140,252,252,0.95)] group-focus-visible:scale-110"
            />
          </button>
        </div>
      </div>
      {/* The bubble sits above the page (the allay itself stays behind) so it can be read. */}
      <div ref={bubbleRef} aria-live="polite" className="pointer-events-none fixed left-0 top-0 z-30 w-max max-w-[200px]">
        {line && (
          <div
            key={line.id}
            className="animate-bubble rounded-xl border border-white/10 bg-bg-raised/95 px-3 py-2 text-xs leading-snug text-ink shadow-lg"
          >
            {line.text}
          </div>
        )}
      </div>
    </>
  );
}
