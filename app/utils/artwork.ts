/* ============================================================
   DUDI — Generated cinematic artwork
   ------------------------------------------------------------
   Every poster / backdrop / thumbnail in this product is an
   original SVG composed at runtime from a seed string, so the
   UI ships with zero third-party or copyrighted imagery.
   Output is deterministic (same seed → same art), which keeps
   SSR and client render byte-identical.

   Markup is written for a small data-URI footprint: single
   quotes (never percent-escaped), integer coordinates and
   single-letter ids. Roughly 2 KB per image.
   ============================================================ */

type Palette = {
  name: string
  deep: string
  mid: string
  glow: string
  spark: string
}

const PALETTES: Palette[] = [
  { name: 'midnight-iris', deep: '#0d0b2b', mid: '#2a1b6b', glow: '#7b5cff', spark: '#c065ff' },
  { name: 'ember', deep: '#1a0a08', mid: '#5a1d12', glow: '#ff6a3d', spark: '#ffc14d' },
  { name: 'teal-noir', deep: '#04161a', mid: '#0c3b44', glow: '#23d3c4', spark: '#6ef2d8' },
  { name: 'crimson-velvet', deep: '#1a0510', mid: '#5c0f2e', glow: '#ff2d6b', spark: '#ff8fab' },
  { name: 'royal-gold', deep: '#14100a', mid: '#4a3312', glow: '#f0b23c', spark: '#ffe3a1' },
  { name: 'deep-ocean', deep: '#060d1f', mid: '#10306b', glow: '#3d7bff', spark: '#7cd4ff' },
  { name: 'jade', deep: '#05140d', mid: '#0f4230', glow: '#34d17d', spark: '#b6f5c8' },
  { name: 'violet-dusk', deep: '#120a1c', mid: '#3b1a5c', glow: '#a855f7', spark: '#f0a6ff' },
  { name: 'steel-rain', deep: '#0a0e12', mid: '#243040', glow: '#8fa8c8', spark: '#d7e4f5' },
  { name: 'sakura-night', deep: '#160a14', mid: '#55184a', glow: '#ff7ab8', spark: '#ffd1e8' },
  { name: 'amber-desert', deep: '#150e06', mid: '#5a3a12', glow: '#ffab40', spark: '#ffe0a3' },
  { name: 'magenta-neon', deep: '#10061a', mid: '#4a0f52', glow: '#ff3dd1', spark: '#a45cff' },
]

/** FNV-1a — small, fast, stable across environments. */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** mulberry32 PRNG — deterministic sequence from a 32-bit seed. */
function prng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rng = {
  next: () => number
  /** Random integer in [min, max] — all geometry is integral to keep markup short */
  n: (min: number, max: number) => number
}

function makeRng(seed: string): Rng {
  const next = prng(hash(seed))
  return { next, n: (min, max) => Math.round(min + next() * (max - min)) }
}

/* ------------------------------------------------------------
   Compositions
   ------------------------------------------------------------ */

type Ctx = { r: Rng; w: number; h: number }

/** City skyline under a hazy moon. */
function skyline({ r, w, h }: Ctx): string {
  const base = r.n(h * 0.72, h * 0.84)
  let towers = ''
  let windows = ''
  let budget = 44
  let x = -Math.round(w * 0.05)

  while (x < w * 1.05) {
    const tw = r.n(w * 0.05, w * 0.12)
    const th = r.n(h * 0.1, h * 0.42)
    towers += `<rect x='${x}' y='${base - th}' width='${tw}' height='${th + Math.round(h * 0.3)}' opacity='${(r.n(55, 95) / 100).toFixed(2)}'/>`

    const cw = Math.round(w * 0.028)
    const rh = Math.round(h * 0.045)
    for (let c = 0; c * cw < tw - cw && budget > 0; c++) {
      for (let row = 0; row * rh < th - rh && budget > 0; row++) {
        if (r.next() > 0.74) {
          windows += `<rect x='${x + Math.round(w * 0.012) + c * cw}' y='${base - th + rh + row * rh}' width='${Math.round(w * 0.012)}' height='${Math.round(h * 0.016)}'/>`
          budget--
        }
      }
    }
    x += tw + r.n(w * 0.004, w * 0.02)
  }

  return (
    `<circle cx='${r.n(w * 0.58, w * 0.82)}' cy='${r.n(h * 0.18, h * 0.3)}' r='${r.n(w * 0.1, w * 0.19)}' fill='url(%23b)'/>` +
    `<rect y='${base - Math.round(h * 0.02)}' width='${w}' height='${Math.round(h * 0.06)}' fill='url(%23d)' opacity='.7'/>` +
    `<g fill='%2305050a'>${towers}</g><g fill='url(%23c)' opacity='.75'>${windows}</g>`
  )
}

/** Layered mountain ridges behind a low sun. */
function ridges({ r, w, h }: Ctx): string {
  const sunY = r.n(h * 0.32, h * 0.48)
  let layers = ''
  const count = 4
  for (let i = 0; i < count; i++) {
    const yBase = Math.round(h * (0.52 + i * 0.12))
    const steps = r.n(3, 6)
    const pts = [`0,${h}`, `0,${yBase + r.n(-h * 0.04, h * 0.04)}`]
    for (let s = 1; s <= steps; s++) {
      pts.push(`${Math.round((w / steps) * s)},${yBase - r.n(0, h * 0.14)}`)
    }
    pts.push(`${w},${h}`)
    layers += `<polygon points='${pts.join(' ')}' fill='%23${i === count - 1 ? '05050a' : '08080f'}' opacity='${(0.55 + i * 0.14).toFixed(2)}'/>`
  }
  return (
    `<circle cx='${r.n(w * 0.3, w * 0.7)}' cy='${sunY}' r='${r.n(w * 0.13, w * 0.21)}' fill='url(%23b)'/>` +
    `<rect y='${sunY - 2}' width='${w}' height='4' fill='url(%23d)' opacity='.5'/>${layers}`
  )
}

/** Diagonal light shafts with bokeh — concert / variety energy. */
function shafts({ r, w, h }: Ctx): string {
  let beams = ''
  for (let i = r.n(4, 7); i > 0; i--) {
    const ox = r.n(-w * 0.1, w * 1.1)
    beams += `<polygon points='${r.n(w * 0.3, w * 0.7)},0 ${ox},${h} ${ox + r.n(w * 0.05, w * 0.16)},${h}' opacity='${(r.n(18, 50) / 100).toFixed(2)}'/>`
  }
  let bokeh = ''
  for (let i = r.n(8, 14); i > 0; i--) {
    bokeh += `<circle cx='${r.n(0, w)}' cy='${r.n(0, h)}' r='${r.n(w * 0.01, w * 0.055)}' opacity='${(r.n(6, 26) / 100).toFixed(2)}'/>`
  }
  return (
    `<g fill='url(%23e)'>${beams}</g><g fill='url(%23c)'>${bokeh}</g>` +
    `<ellipse cx='${Math.round(w / 2)}' cy='${h}' rx='${Math.round(w * 0.7)}' ry='${Math.round(h * 0.3)}' fill='%2305050a' opacity='.85'/>`
  )
}

/** Single figure in a spotlight — drama / portrait key art. */
function spotlight({ r, w, h }: Ctx): string {
  const cx = r.n(w * 0.38, w * 0.62)
  const hr = r.n(w * 0.1, w * 0.14)
  const hy = r.n(h * 0.5, h * 0.6)
  const sy = Math.round(hy + hr * 1.5)
  const edge = Math.round(w * 0.06)
  const sL = Math.round(cx - hr * 2.6)
  const sR = Math.round(cx + hr * 2.6)
  const gL = Math.round(cx - hr * 1.1)
  const gR = Math.round(cx + hr * 1.1)
  return (
    `<ellipse cx='${cx}' cy='${hy - Math.round(h * 0.08)}' rx='${Math.round(w * 0.46)}' ry='${Math.round(h * 0.34)}' fill='url(%23b)' opacity='.9'/>` +
    `<g fill='%2305050a'><circle cx='${cx}' cy='${hy}' r='${hr}'/>` +
    `<path d='M${sL},${h}C${Math.round(cx - hr * 2.3)},${sy + Math.round(hr * 0.2)} ${gL},${sy} ${cx},${sy}C${gR},${sy} ${Math.round(cx + hr * 2.3)},${sy + Math.round(hr * 0.2)} ${sR},${h}Z'/>` +
    `<rect width='${edge}' height='${h}' opacity='.5'/><rect x='${w - edge}' width='${edge}' height='${h}' opacity='.5'/></g>`
  )
}

/** Flowing bands — music / abstract. */
function waves({ r, w, h }: Ctx): string {
  let bands = ''
  for (let i = r.n(5, 8); i > 0; i--) {
    const y = r.n(h * 0.25, h * 0.95)
    const amp = r.n(h * 0.04, h * 0.16)
    bands += `<path d='M0,${y}C${Math.round(w * 0.25)},${y - amp} ${Math.round(w * 0.6)},${y + amp} ${w},${y - Math.round(amp * 0.4)}' stroke-width='${r.n(h * 0.004, h * 0.02)}' opacity='${(r.n(20, 75) / 100).toFixed(2)}'/>`
  }
  const acx = r.n(w * 0.2, w * 0.8)
  const acy = r.n(h * 0.3, h * 0.5)
  let arcs = ''
  for (let i = 1; i <= 4; i++) {
    arcs += `<circle cx='${acx}' cy='${acy}' r='${Math.round(w * 0.09 * i)}' opacity='${(0.14 / i).toFixed(2)}'/>`
  }
  return (
    `<circle cx='${acx}' cy='${acy}' r='${Math.round(w * 0.24)}' fill='url(%23b)'/>` +
    `<g fill='none' stroke='%23ffffff'>${arcs}</g>` +
    `<g fill='none' stroke='url(%23c)' stroke-linecap='round'>${bands}</g>` +
    `<ellipse cx='${Math.round(w / 2)}' cy='${h}' rx='${Math.round(w * 0.8)}' ry='${Math.round(h * 0.28)}' fill='%2305050a' opacity='.8'/>`
  )
}

/** Perspective horizon grid — gaming / esports. */
function horizon({ r, w, h }: Ctx): string {
  const hy = r.n(h * 0.52, h * 0.64)
  const vpx = r.n(w * 0.35, w * 0.65)
  let grid = ''
  for (let i = -6; i <= 6; i++) {
    grid += `<path d='M${vpx},${hy}L${Math.round(vpx + i * w * 0.34)},${h}'/>`
  }
  for (let i = 1; i <= 8; i++) {
    const y = Math.round(hy + Math.pow(i / 8, 2.1) * (h - hy))
    grid += `<path d='M0,${y}H${w}'/>`
  }
  return (
    `<circle cx='${vpx}' cy='${hy - Math.round(h * 0.06)}' r='${Math.round(w * 0.17)}' fill='url(%23b)'/>` +
    `<rect y='${hy - 1}' width='${w}' height='2' fill='url(%23d)' opacity='.85'/>` +
    `<g fill='none' stroke='url(%23c)' stroke-width='1.2' opacity='.28'>${grid}</g>`
  )
}

const COMPOSITIONS = [skyline, ridges, shafts, spotlight, waves, horizon]

/* ------------------------------------------------------------
   Renderer
   ------------------------------------------------------------ */

export interface ArtOptions {
  /** Force a composition index (0–5) — otherwise derived from the seed */
  variant?: number
  /** Extra darkening for backdrops that sit under text */
  moody?: boolean
}

function renderArt(seed: string, w: number, h: number, opts: ArtOptions = {}): string {
  const r = makeRng(seed)
  const p = PALETTES[hash(seed + '::p') % PALETTES.length] as Palette
  const idx = opts.variant ?? hash(seed + '::c') % COMPOSITIONS.length
  const compose = COMPOSITIONS[idx % COMPOSITIONS.length] as (c: Ctx) => string
  const tilt = hash(seed + '::t') % 2
  const body = compose({ r, w, h })
  const c = (hex: string) => `%23${hex.slice(1)}`

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    `<defs>` +
    `<linearGradient id='a' x1='0' y1='0' x2='${tilt}' y2='1'>` +
    `<stop offset='0' stop-color='${c(p.mid)}'/><stop offset='.55' stop-color='${c(p.deep)}'/><stop offset='1' stop-color='%2305050a'/></linearGradient>` +
    `<radialGradient id='b'>` +
    `<stop offset='0' stop-color='${c(p.spark)}' stop-opacity='.95'/>` +
    `<stop offset='.42' stop-color='${c(p.glow)}' stop-opacity='.45'/>` +
    `<stop offset='1' stop-color='${c(p.glow)}' stop-opacity='0'/></radialGradient>` +
    `<linearGradient id='c' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${c(p.spark)}'/><stop offset='1' stop-color='${c(p.glow)}'/></linearGradient>` +
    `<linearGradient id='d'>` +
    `<stop offset='0' stop-color='${c(p.glow)}' stop-opacity='0'/>` +
    `<stop offset='.5' stop-color='${c(p.spark)}' stop-opacity='.9'/>` +
    `<stop offset='1' stop-color='${c(p.glow)}' stop-opacity='0'/></linearGradient>` +
    `<linearGradient id='e' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='${c(p.spark)}' stop-opacity='.75'/>` +
    `<stop offset='1' stop-color='${c(p.glow)}' stop-opacity='0'/></linearGradient>` +
    `<radialGradient id='f' cy='.45' r='.78'>` +
    `<stop offset='.45' stop-opacity='0'/><stop offset='1' stop-opacity='${opts.moody ? '.85' : '.6'}'/></radialGradient>` +
    `<pattern id='g' width='6' height='6' patternUnits='userSpaceOnUse' patternTransform='rotate(${r.n(20, 70)})'>` +
    `<path d='M0,0V6' stroke='%23fff' opacity='.04'/></pattern>` +
    `</defs>` +
    `<rect width='${w}' height='${h}' fill='url(%23a)'/>` +
    body +
    `<rect width='${w}' height='${h}' fill='url(%23g)'/>` +
    `<rect width='${w}' height='${h}' fill='url(%23f)'/>` +
    `</svg>`

  return `data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/ /g, '%20').replace(/"/g, '%22')}`
}

/* ------------------------------------------------------------
   Public helpers — one per aspect ratio used in the product
   ------------------------------------------------------------ */

/** 2:3 key art for poster grids and rails. */
export const posterArt = (seed: string, opts?: ArtOptions) => renderArt(seed, 400, 600, opts)

/** 16:9 thumbnail for landscape rails, live cards and players. */
export const landscapeArt = (seed: string, opts?: ArtOptions) => renderArt(seed, 640, 360, opts)

/** Ultra-wide hero / detail backdrop. */
export const backdropArt = (seed: string, opts?: ArtOptions) =>
  renderArt(seed, 1440, 810, { moody: true, ...opts })

/** 16:10 editorial card used by the variety-show rail. */
export const wideArt = (seed: string, opts?: ArtOptions) => renderArt(seed, 560, 350, opts)

/** Compact gradient avatar with initials — for creators and profiles. */
export function avatarArt(seed: string, name: string): string {
  const p = PALETTES[hash(seed + '::av') % PALETTES.length] as Palette
  const initials = name
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => [...w][0] ?? '')
    .join('')
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>` +
    `<defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='%23${p.glow.slice(1)}'/><stop offset='1' stop-color='%23${p.deep.slice(1)}'/>` +
    `</linearGradient></defs>` +
    `<rect width='96' height='96' rx='48' fill='url(%23a)'/>` +
    `<circle cx='30' cy='26' r='26' fill='%23${p.spark.slice(1)}' opacity='.25'/>` +
    `<text x='48' y='50' font-family='sans-serif' font-size='34' font-weight='700' fill='%23fff' fill-opacity='.94' text-anchor='middle' dominant-baseline='central'>${initials}</text>` +
    `</svg>`
  return `data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/ /g, '%20').replace(/"/g, '%22')}`
}

/**
 * Fictional QR-style graphic for the mock payment screen.
 * It is decorative only — the modules carry no encoded data.
 */
export function qrArt(seed: string): string {
  const r = makeRng(`${seed}::qr`)
  const N = 25
  const q = 2 // quiet zone in modules
  const size = N + q * 2
  let cells = ''

  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8)

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue
      if (r.next() > 0.52) cells += `<rect x='${x + q}' y='${y + q}' width='1' height='1'/>`
    }
  }

  const finder = (x: number, y: number) =>
    `<rect x='${x + q}' y='${y + q}' width='7' height='7' rx='1.6'/>` +
    `<rect x='${x + q + 1}' y='${y + q + 1}' width='5' height='5' rx='1' fill='%23fff'/>` +
    `<rect x='${x + q + 2}' y='${y + q + 2}' width='3' height='3' rx='.6'/>`

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}' shape-rendering='crispEdges'>` +
    `<rect width='${size}' height='${size}' fill='%23fff'/>` +
    `<g fill='%230b0b0f'>${cells}${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</g>` +
    `</svg>`

  return `data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/ /g, '%20').replace(/"/g, '%22')}`
}

/** Palette glow colour for a seed — lets UI tint chrome to match its artwork. */
export function accentFor(seed: string): string {
  return (PALETTES[hash(seed + '::p') % PALETTES.length] as Palette).glow
}
