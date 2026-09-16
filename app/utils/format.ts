/* Small display formatters shared across the UI. */

/** 1240 → "1.2พัน" · 24500 → "2.5หมื่น" · 1250000 → "1.3ล้าน" */
export function formatCountTh(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')} ล้าน`
  if (n >= 10_000) return `${(n / 10_000).toFixed(1).replace(/\.0$/, '')} หมื่น`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')} พัน`
  return n.toLocaleString('th-TH')
}

/** Compact latin form for dense chrome (chat, badges): 12.4K */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return `${n}`
}

/** 105 → "1 ชม. 45 นาที" */
export function formatRuntime(minutes?: number): string {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m} นาที`
  return m ? `${h} ชม. ${m} นาที` : `${h} ชม.`
}

/** Seconds → 1:04:12 / 4:07 */
export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

export const KIND_LABEL: Record<string, string> = {
  movie: 'ภาพยนตร์',
  drama: 'ละคร',
  series: 'ซีรีส์',
  show: 'รายการ',
  concert: 'คอนเสิร์ต',
}
