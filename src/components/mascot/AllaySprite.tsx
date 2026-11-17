/**
 * The allay, as pixel art drawn in code (one character per pixel, traced from the
 * reference render). The wings are drawn as a separate layer so they can flap.
 *
 * Edit a pixel by changing its letter; "." is empty. Colors are in PALETTE.
 */
const PIXELS = [
  "...........DD.........................",
  ".........CDDDDC.........I.............",
  ".......BCCCCCCCCB......III............",
  ".....BBBBBBBBBBBBBB....III............",
  "...AAAABBBBBBBBBBCCCC..NI.............",
  ".AAAAABBBBBBBBBBBBCCDDDNN.............",
  "GAAAAABBBBBBBBBBBBCCDDDPN.............",
  "GGGAAAABBBBBBBBBBCCCCPPP...O.........M",
  "GGGFFBBBBABBBBABBBBMMMPPO.OOO.......MM",
  "FGGFFFFBAAAAAAAABMMMMMPMOOOOOL....TMM.",
  "FFFFFFFFFAAAAAAMMMMMMMMMOOLOLLL..TT...",
  "FFFJJFFFFFGAAMMMMMMMMMMMOLLLLLL.TT....",
  "JFFJJJJFFFGGMMMMMPPMMMMMLLLL.L.TT..RR.",
  "JJJJJJJJJFGGMMMPPPPMMMMML.L..TTTRRRRRQ",
  "JJJEEJJJJJFGMMPPPPRPPPMM....TTTRRSSQQQ",
  "JJJEEJJJJJFFMMPPPRRPPPPP...TTSSRSS.QQ.",
  "JJJEEJJEEJFFMMPUURRPRPPP..RRSSS.S.....",
  "JJJEEJJEEEJJPPUUURURRRPP.RR...........",
  "KKJEEJJEEEJJPPUUUUURRRRRTR............",
  "KKKJEJJEEEJJPPTTTUURUURRTR............",
  "KKKJJJJEEEJJTTTTTUTUUURRRR............",
  "..KJJJJJEEJJTTTTTTTUURSRRQQ...........",
  "..HHJJJJJJJJTTTTTTTURQQ.QQ............",
  ".HHHRRJJJJKKUUTTTTKKQQ................",
  ".HHUUUKKJJKKUUTTKKKKN.................",
  "HHHUUUKKOOKKUUHHHKNNN.................",
  ".HTTTUOKOOOLLSHHHNNNN.................",
  ".HTT..OOOOOLLSSHHNNNNK................",
  "......OOLLLLLSSHHHNNKK................",
  ".......OLLLGGGGHHHKKKKK...............",
  ".......LLLLGGGGGHHKKKKK...............",
  ".......GGLL....GHHHKKNN...............",
  ".......GGLG....GHHHKKNNN..............",
  ".......GG........HHHKKNN..............",
  "........G........HHHKK................",
  "..................HH..................",
];

const PALETTE: Record<string, string> = {
  A: "#8cfcfc",
  B: "#66fcfc",
  C: "#4efcfc",
  D: "#3ceaf0",
  E: "#aeaeae",
  F: "#50aeae",
  G: "#6e9daf",
  H: "#2d9bc0",
  I: "#3096a8",
  J: "#2c9eaa",
  K: "#188ca8",
  L: "#356f96",
  M: "#246c78",
  N: "#0b81a6",
  O: "#187599",
  P: "#186672",
  Q: "#3c6078",
  R: "#12546c",
  S: "#224c6a",
  T: "#0c6078",
  U: "#0c5a72",
};

/** Pixels at or right of this column (and at or above WING_LAST_ROW) belong to the wings. */
const WING_FIRST_COL = 24;
const WING_LAST_ROW = 22;

const W = PIXELS[0].length;
const H = PIXELS.length;

type Run = { x: number; y: number; w: number; fill: string };

function runs(part: "body" | "wing"): Run[] {
  const out: Run[] = [];
  PIXELS.forEach((row, y) => {
    let x = 0;
    while (x < W) {
      const ch = row[x];
      const isWing = x >= WING_FIRST_COL && y <= WING_LAST_ROW;
      if (ch === "." || isWing !== (part === "wing")) {
        x++;
        continue;
      }
      let end = x + 1;
      while (end < W && row[end] === ch && (end >= WING_FIRST_COL && y <= WING_LAST_ROW) === isWing) end++;
      out.push({ x, y, w: end - x, fill: PALETTE[ch] });
      x = end;
    }
  });
  return out;
}

const BODY = runs("body");
const WING = runs("wing");

export function AllaySprite({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={size}
      height={(size * H) / W}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      <g className="allay-wing">
        {WING.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </g>
      <g>
        {BODY.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </g>
    </svg>
  );
}
