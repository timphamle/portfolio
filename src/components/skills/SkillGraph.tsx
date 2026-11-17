"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SkillGroup } from "@/content/types";
import { SkillGroups } from "@/components/cards/EducationCard";

/**
 * 3D "neuron" graph of skills, drawn on a canvas.
 * Center node -> one hub per skill group -> each skill. Cross-links come from `links`.
 * Drag to rotate, hover (or tap) a node to light up its connections.
 */

const COLORS = ["#5cc2f2", "#4cc26a", "#a78bfa", "#f2a65c", "#f472b6", "#facc15"];
const INK = "#e6ebf5";
const CAMERA = 5;

type Kind = "me" | "group" | "skill";
interface GNode {
  label: string;
  kind: Kind;
  group: number;
  pos: [number, number, number];
}
interface GEdge {
  a: number;
  b: number;
  kind: "core" | "member" | "cross";
}
interface Projected {
  x: number;
  y: number;
  z: number;
  s: number;
}

function normalize([x, y, z]: number[]): [number, number, number] {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

function buildGraph(groups: SkillGroup[], links: [string, string][]) {
  const nodes: GNode[] = [{ label: "me", kind: "me", group: -1, pos: [0, 0, 0] }];
  const edges: GEdge[] = [];
  const index = new Map<string, number>();
  const golden = Math.PI * (3 - Math.sqrt(5));

  groups.forEach((g, gi) => {
    const angle = (gi / groups.length) * Math.PI * 2 + 0.5;
    const dir = normalize([Math.cos(angle), gi % 2 ? 0.38 : -0.38, Math.sin(angle)]);
    const hub = nodes.length;
    nodes.push({ label: g.label, kind: "group", group: gi, pos: dir });
    edges.push({ a: 0, b: hub, kind: "core" });

    g.items.forEach((item, j) => {
      const k = g.items.length;
      const y = 1 - (2 * (j + 0.5)) / k;
      const rad = Math.sqrt(1 - y * y);
      const th = j * golden;
      const v = normalize([Math.cos(th) * rad + dir[0] * 1.05, y + dir[1] * 1.05, Math.sin(th) * rad + dir[2] * 1.05]);
      const dist = 0.58 + 0.3 * (((j * 7) % 5) / 4);
      const id = nodes.length;
      nodes.push({ label: item, kind: "skill", group: gi, pos: [dir[0] + v[0] * dist, dir[1] + v[1] * dist, dir[2] + v[2] * dist] });
      index.set(item, id);
      edges.push({ a: hub, b: id, kind: "member" });
    });
  });

  for (const [a, b] of links) {
    const ia = index.get(a);
    const ib = index.get(b);
    if (ia === undefined || ib === undefined) {
      if (process.env.NODE_ENV !== "production") console.warn(`skillLinks: unknown skill in ["${a}", "${b}"]`);
      continue;
    }
    edges.push({ a: ia, b: ib, kind: "cross" });
  }

  const neighbors = nodes.map(() => new Set<number>());
  for (const e of edges) {
    neighbors[e.a].add(e.b);
    neighbors[e.b].add(e.a);
  }
  return { nodes, edges, neighbors };
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export function SkillGraph({ groups, links }: { groups: SkillGroup[]; links: [string, string][] }) {
  const graph = useMemo(() => buildGraph(groups, links), [groups, links]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<"graph" | "list">("graph");
  const [active, setActive] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  const selectRef = useRef<number | null>(null);

  const syncActive = () => setActive(hoverRef.current ?? selectRef.current);

  useEffect(() => {
    if (view !== "graph") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { nodes, edges, neighbors } = graph;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(canvas).fontFamily || "sans-serif";

    let w = 0;
    let h = 0;
    let yaw = 0.6;
    let pitch = -0.32;
    let yawVel = 0;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    const proj: Projected[] = nodes.map(() => ({ x: 0, y: 0, z: 0, s: 1 }));
    let down = false;
    let dragging = false;
    let startX = 0, startY = 0, lastX = 0, lastY = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const project = ([x, y, z]: [number, number, number], scale: number, out: Projected) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const s = CAMERA / (CAMERA - z2);
      out.x = w / 2 + x1 * scale * s;
      out.y = h / 2 - y2 * scale * s;
      out.z = z2;
      out.s = s;
      return out;
    };

    const ring = (radius: number, scale: number, dash: number[]) => {
      const tmp: Projected = { x: 0, y: 0, z: 0, s: 1 };
      ctx.beginPath();
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        project([Math.cos(a) * radius, 0, Math.sin(a) * radius], scale, tmp);
        if (i === 0) ctx.moveTo(tmp.x, tmp.y);
        else ctx.lineTo(tmp.x, tmp.y);
      }
      ctx.setLineDash(dash);
      ctx.strokeStyle = "rgba(143, 155, 179, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const color = (n: GNode) => (n.kind === "me" ? INK : COLORS[n.group % COLORS.length]);

    const draw = () => {
      const scale = Math.min(w, h) / 2 / 2.2;
      const fs = Math.min(1, Math.max(0.78, w / 560));
      ctx.clearRect(0, 0, w, h);
      nodes.forEach((n, i) => project(n.pos, scale, proj[i]));

      const act = hoverRef.current ?? selectRef.current;
      const lit = new Set<number>();
      if (act !== null) {
        lit.add(act);
        neighbors[act].forEach((n) => lit.add(n));
      }
      const depth = (z: number) => Math.min(1, Math.max(0, (z + 1.8) / 3.6));

      ring(1, scale, [3, 5]);
      ring(1.75, scale, [2, 7]);

      // Edges
      for (const e of edges) {
        const a = proj[e.a], b = proj[e.b];
        const on = act !== null && (e.a === act || e.b === act);
        const d = (depth(a.z) + depth(b.z)) / 2;
        let stroke: string;
        let width = 1;
        if (on) {
          const n = nodes[act!].kind === "me" ? nodes[e.a === act ? e.b : e.a] : nodes[act!];
          stroke = hexA(n.kind === "me" ? INK : COLORS[n.group % COLORS.length], 0.85);
          width = 1.6;
        } else if (act !== null) {
          stroke = "rgba(143, 155, 179, 0.05)";
        } else if (e.kind === "cross") {
          stroke = `rgba(230, 235, 245, ${0.05 + 0.1 * d})`;
        } else {
          const n = nodes[e.b];
          stroke = hexA(COLORS[n.group % COLORS.length], (e.kind === "core" ? 0.3 : 0.18) + 0.2 * d);
          width = e.kind === "core" ? 1.4 : 1;
        }
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Nodes + labels, back to front
      const order = nodes.map((_, i) => i).sort((i, j) => proj[i].z - proj[j].z);
      for (const i of order) {
        const n = nodes[i];
        const p = proj[i];
        const d = depth(p.z);
        const dim = act !== null && !lit.has(i);
        const isAct = act === i;
        const base = n.kind === "me" ? 11 : n.kind === "group" ? 7.5 : 4;
        const r = base * p.s * (isAct ? 1.35 : 1);
        const c = color(n);
        const alpha = dim ? 0.15 : 0.45 + 0.55 * d;

        if (n.kind !== "skill" && !dim) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = hexA(c, 0.12);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = hexA(c, alpha);
        ctx.fill();
        if (isAct) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = hexA(c, 0.9);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        const size = n.kind === "me" ? 14 : n.kind === "group" ? 13 : 11.5;
        const weight = n.kind === "skill" ? (isAct ? 600 : 400) : 700;
        ctx.font = `${weight} ${Math.max(8.5, size * fs * Math.min(1.15, p.s))}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        const textA = dim ? 0.1 : n.kind === "skill" ? (act !== null ? 0.95 : 0.3 + 0.6 * d) : 0.55 + 0.45 * d;
        ctx.fillStyle = n.kind === "skill" ? `rgba(230, 235, 245, ${textA})` : hexA(n.kind === "me" ? INK : c, textA);
        ctx.fillText(n.label, p.x, p.y - r - 5);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        yaw += yawVel;
        yawVel *= Math.pow(0.04, dt);
        if (!reduced && hoverRef.current === null && Math.abs(yawVel) < 0.002) yaw += dt * 0.12;
      }
      draw();
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);

    // Pointer interaction

    const pick = (x: number, y: number) => {
      let best: number | null = null;
      let bestZ = -Infinity;
      nodes.forEach((n, i) => {
        const p = proj[i];
        const base = n.kind === "me" ? 11 : n.kind === "group" ? 7.5 : 4;
        const hit = Math.max(12, base * p.s + 6);
        if (Math.hypot(p.x - x, p.y - y) <= hit && p.z > bestZ) {
          best = i;
          bestZ = p.z;
        }
      });
      return best;
    };
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      down = true;
      dragging = false;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (down) {
        if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 4) dragging = true;
        if (dragging) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          yaw += dx * 0.008;
          yawVel = dx * 0.008;
          pitch = Math.max(-1.2, Math.min(1.2, pitch + dy * 0.006));
          canvas.style.cursor = "grabbing";
        }
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      if (e.pointerType !== "mouse") return;
      const { x, y } = local(e);
      const hit = pick(x, y);
      canvas.style.cursor = hit !== null ? "pointer" : "grab";
      if (hit !== hoverRef.current) {
        hoverRef.current = hit;
        syncActive();
      }
    };
    const onUp = (e: PointerEvent) => {
      if (down && !dragging) {
        const { x, y } = local(e);
        const hit = pick(x, y);
        selectRef.current = hit === selectRef.current ? null : hit;
        syncActive();
      }
      down = false;
      dragging = false;
      canvas.style.cursor = "grab";
    };
    const onCancel = () => {
      down = false;
      dragging = false;
    };
    const onLeave = () => {
      if (hoverRef.current !== null) {
        hoverRef.current = null;
        syncActive();
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onCancel);
    canvas.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [graph, view]);

  const caption = (() => {
    if (active === null) return null;
    const n = graph.nodes[active];
    if (n.kind === "me") return "Everything connects back here.";
    if (n.kind === "group") return `${n.label}: ${groups[n.group].items.join(", ")}`;
    const related = [...graph.neighbors[active]]
      .map((i) => graph.nodes[i])
      .filter((m) => m.kind === "skill")
      .map((m) => m.label);
    const g = groups[n.group].label;
    return related.length ? `${n.label} (${g}) · used with ${related.join(", ")}` : `${n.label} (${g})`;
  })();

  const focusGroup = (gi: number | null) => {
    const idx = gi === null ? null : graph.nodes.findIndex((n) => n.kind === "group" && n.group === gi);
    hoverRef.current = idx;
    syncActive();
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-ink">Skills</h3>
        <div className="flex rounded-full border border-white/10 p-0.5 text-xs font-medium" role="group" aria-label="Skills view">
          {(["graph", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded-full px-3 py-1 capitalize transition ${view === v ? "bg-accent-soft text-accent" : "text-faint hover:text-ink"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "graph" ? (
        <>
          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-bg-raised/40">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Interactive 3D graph of skills in ${groups.length} groups: ${groups.map((g) => g.label).join(", ")}. Switch to List view for a text version.`}
              className="block h-[360px] w-full cursor-grab touch-pan-y select-none sm:h-[440px]"
            />
            <p className="pointer-events-none absolute bottom-3 right-4 font-mono text-[11px] text-faint">drag to rotate · hover a node</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {groups.map((g, gi) => (
              <button
                key={g.label}
                type="button"
                data-no-pop
                onMouseEnter={() => focusGroup(gi)}
                onMouseLeave={() => focusGroup(null)}
                onFocus={() => focusGroup(gi)}
                onBlur={() => focusGroup(null)}
                className="flex items-center gap-2 text-xs font-medium text-muted transition hover:text-ink"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[gi % COLORS.length] }} />
                {g.label}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-3 min-h-[2.75rem] text-sm leading-snug text-muted">
            {caption ?? "Each skill sits in its group and links to the tools I've used it with."}
          </p>
        </>
      ) : (
        <SkillGroups groups={groups} />
      )}
    </div>
  );
}
