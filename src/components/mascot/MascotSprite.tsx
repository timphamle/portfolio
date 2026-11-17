/**
 * Mascot: a blue allay, hand-drawn as our own pixel art (fan art, not a game texture).
 * To swap in different art later, replace the <svg> with an <img src="/mascot/idle.png" />
 * (or a sprite sheet) and keep the same props.
 *
 * Legend:  O outline · L light body · B body · D deep blue · W highlight
 *          K eye · w wing · . empty
 */
const PIXELS = [
  "................",
  ".....OOOOOO.....",
  "....OLLLLLLO....",
  "...OLWLLLLLLO...",
  "...OLLLLLLLLO...",
  "...OLKKLLKKLO...",
  "...OLKKLLKKLO...",
  "...OLLLLLLLLO...",
  "....OOBBBBOO....",
  "ww..OBLLLLBO..ww",
  "wwwOBBLLLLBBOwww",
  ".ww.OBBBBBBO.ww.",
  "....OBBBBBBO....",
  ".....OBDDBO.....",
  "......ODDO......",
  ".......OO.......",
];

const COLORS: Record<string, string> = {
  O: "#16406e",
  L: "#a8e8ff",
  B: "#5cc2f2",
  D: "#2b86cf",
  W: "#ffffff",
  K: "#14284d",
  w: "rgba(190, 240, 255, 0.55)",
};

export function MascotSprite({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  // "happy" pose: closed, smiling eyes.
  const rows = happy
    ? PIXELS.map((r, y) => (y === 5 ? "...OLLLLLLLLO..." : y === 6 ? "...OLKKLLKKLO..." : r))
    : PIXELS;
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      shapeRendering="crispEdges"
      style={{ filter: "drop-shadow(0 0 6px rgba(92, 194, 242, 0.55))" }}
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLORS[c]} /> : null,
        ),
      )}
    </svg>
  );
}
