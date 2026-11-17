/**
 * PLACEHOLDER mascot: an original pixel-art spiky-shelled dino kid.
 * Swap this for real art later: replace the <svg> with an <img src="/mascot/idle.png" />
 * (or a sprite sheet) and keep the same props.
 *
 * Legend:  O outline · S skin · H hair · W white · K pupil · R mouth
 *          B bandana · G shell · g shell shade · . empty
 */
const PIXELS = [
  "......HH.H......",
  ".....HHHHHH.....",
  "....OOOOOOOO....",
  "...OSSSSSSSSO...",
  "..OSSSSSSSSSSO..",
  "..OSWWSSSSWWSO..",
  "..OSWKSSSSWKSO..",
  "..OSSSSSSSSSSO..",
  "..OSSSRWRRSSSO..",
  "...OSSSSSSSSO...",
  "....OBBBBBBO....",
  "...WOGGSSGGOW...",
  "..OGGGSSSSGGGO..",
  "..OGgGSSSSGgGO..",
  "...OGGSSSSGGO...",
  "...OSSO..OSSO...",
  "...OOOO..OOOO...",
];

const COLORS: Record<string, string> = {
  O: "#1b130c",
  S: "#f4c873",
  H: "#ff7a29",
  W: "#ffffff",
  K: "#111111",
  R: "#c92f2f",
  B: "#ff8a3d",
  G: "#4cc26a",
  g: "#2f8a47",
};

export function MascotSprite({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  // "happy" pose: closed, smiling eyes.
  const rows = happy
    ? PIXELS.map((r, y) => (y === 5 ? "..OSSSSSSSSSSO.." : y === 6 ? "..OSKKSSSSKKSO.." : r))
    : PIXELS;
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={size} height={(size * h) / w} shapeRendering="crispEdges" aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLORS[c]} /> : null,
        ),
      )}
    </svg>
  );
}
