/* Geometric ornament drawn in code: eight-point star (khatam) lattice and the mihrab arch mask. */

const TAU = Math.PI * 2;

/** 2n-point star polygon: outer radius R, inner radius r, rotated by rot (radians) */
export function starPoints(cx: number, cy: number, R: number, r: number, n = 8, rot = 0) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * TAU) / (n * 2) - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

// inner radius that makes an 8-point star from two overlapping squares
const KHATAM = Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);

/** Tiled khatam lattice as an SVG pattern. Place inside an absolutely positioned container. */
export function StarLattice({
  id = "lattice",
  size = 96,
  stroke = "currentColor",
  opacity = 0.12,
  className = "",
}: {
  id?: string;
  size?: number;
  stroke?: string;
  opacity?: number;
  className?: string;
}) {
  const h = size / 2;
  const R = size * 0.34;
  const r = R * KHATAM;
  const star = (cx: number, cy: number) => starPoints(cx, cy, R, r, 8, 0);
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={stroke} strokeWidth="1" opacity={opacity}>
            <polygon points={star(h, h)} />
            {[0, size].map((x) => [0, size].map((y) => <polygon key={`${x}${y}`} points={star(x, y)} />))}
            <rect x={h - R * 0.48} y={h - R * 0.48} width={R * 0.96} height={R * 0.96} transform={`rotate(45 ${h} ${h})`} />
            <line x1={h} y1={h - R} x2={h} y2={0} />
            <line x1={h} y1={h + R} x2={h} y2={size} />
            <line x1={h - R} y1={h} x2={0} y2={h} />
            <line x1={h + R} y1={h} x2={size} y2={h} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Mount once per page: defines the pointed-arch clip path used by `.arch` */
export function ArchDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
          <path d="M0,1 V0.36 C0,0.17 0.22,0.05 0.5,0 C0.78,0.05 1,0.17 1,0.36 V1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Small eight-point star used as a divider glyph */
export function StarGlyph({ className = "h-4 w-4", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <polygon
        points={starPoints(12, 12, 11, 11 * KHATAM, 8)}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Centered ornament divider: line, star, line */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-4 text-brick ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-brick/70" />
      <StarGlyph className="h-4 w-4" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-brick/70" />
    </div>
  );
}
