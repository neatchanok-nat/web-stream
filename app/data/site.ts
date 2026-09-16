import type { ContinueItem, PricingPlan } from '~/types'

/* ============================================================
   Site-level mock data: rails, pricing, profile, search
   ============================================================ */

export const CONTINUE_WATCHING: ContinueItem[] = [
  {
    id: 'cw-1',
    titleId: 'sr-khadi-lap-7',
    title: 'คดีลับหมายเลข 7',
    episodeLabel: 'S2 · EP4 · แฟ้มที่หายไป',
    progress: 62,
    remainingLabel: 'เหลืออีก 18 นาที',
    artSeed: 'sr-khadi-lap-7-art',
  },
  {
    id: 'cw-2',
    titleId: 'dr-buang-rak',
    title: 'บ่วงรักมายา',
    episodeLabel: 'EP12 · คำสารภาพ',
    progress: 24,
    remainingLabel: 'เหลืออีก 51 นาที',
    artSeed: 'dr-buang-rak-art',
  },
  {
    id: 'cw-3',
    titleId: 'mv-bangkok-night-rider',
    title: 'บางกอกไนต์ไรเดอร์',
    episodeLabel: 'ภาพยนตร์',
    progress: 78,
    remainingLabel: 'เหลืออีก 26 นาที',
    artSeed: 'mv-bangkok-night-rider-art',
  },
  {
    id: 'cw-4',
    titleId: 'sh-game-rua-rua',
    title: 'เกมรัวๆ ท้าให้ตอบ',
    episodeLabel: 'EP31 · ศึกแชมป์เก่า',
    progress: 45,
    remainingLabel: 'เหลืออีก 33 นาที',
    artSeed: 'sh-game-rua-rua-art',
  },
  {
    id: 'cw-5',
    titleId: 'sr-rahat-lap-phaya-nak',
    title: 'รหัสลับพญานาค',
    episodeLabel: 'EP2 · จารึกริมโขง',
    progress: 12,
    remainingLabel: 'เหลืออีก 44 นาที',
    artSeed: 'sr-rahat-lap-phaya-nak-art',
  },
  {
    id: 'cw-6',
    titleId: 'dr-thayat-sua',
    title: 'ทายาทตระกูลเสือ',
    episodeLabel: 'EP7 · เส้นทางขนส่ง',
    progress: 88,
    remainingLabel: 'เหลืออีก 9 นาที',
    artSeed: 'dr-thayat-sua-art',
  },
]

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    priceLabel: '0',
    period: 'ตลอดชีพ',
    blurb: 'เริ่มดูได้ทันที ไม่มีค่าใช้จ่าย',
    cta: 'เริ่มใช้งานฟรี',
    features: [
      { label: 'คอนเทนต์ฟรีกว่า 3,000 ชั่วโมง', included: true },
      { label: 'ความคมชัดสูงสุด 720p', included: true },
      { label: 'รับชมได้ 1 อุปกรณ์', included: true },
      { label: 'ไลฟ์สดสาธารณะ', included: true },
      { label: 'ไม่มีโฆษณาคั่น', included: false },
      { label: 'ดาวน์โหลดดูออฟไลน์', included: false },
      { label: 'DUDI Originals', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'STANDARD',
    price: 99,
    priceLabel: '99',
    period: 'ต่อเดือน',
    blurb: 'ดูครบทุกหมวด ไม่มีโฆษณาคั่น',
    cta: 'เลือกแพ็กเกจ',
    features: [
      { label: 'คอนเทนต์ทั้งหมดรวมละครและซีรีส์', included: true },
      { label: 'ความคมชัดสูงสุด 1080p', included: true },
      { label: 'รับชมพร้อมกัน 2 อุปกรณ์', included: true },
      { label: 'ไลฟ์สดทุกช่อง', included: true },
      { label: 'ไม่มีโฆษณาคั่น', included: true },
      { label: 'ดาวน์โหลดดูออฟไลน์ 10 เรื่อง', included: true },
      { label: 'DUDI Originals', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 149,
    priceLabel: '149',
    period: 'ต่อเดือน',
    blurb: 'ครบทุกสิทธิ์ คมชัดระดับ 4K พร้อมออริจินัล',
    cta: 'เลือกแพ็กเกจ',
    highlight: true,
    badge: 'คุ้มที่สุด',
    features: [
      { label: 'คอนเทนต์ทั้งหมดไม่มีข้อจำกัด', included: true },
      { label: 'ความคมชัดสูงสุด 4K HDR + Dolby Atmos', included: true },
      { label: 'รับชมพร้อมกัน 4 อุปกรณ์', included: true },
      { label: 'ไลฟ์สดทุกช่อง + ดูย้อนหลัง 30 วัน', included: true },
      { label: 'ไม่มีโฆษณาคั่น', included: true },
      { label: 'ดาวน์โหลดดูออฟไลน์ไม่จำกัด', included: true },
      { label: 'DUDI Originals ดูก่อนใคร', included: true },
    ],
  },
]

export const PRICING_FAQ = [
  {
    q: 'ยกเลิกแพ็กเกจได้ตลอดเวลาไหม',
    a: 'ยกเลิกได้ทุกเมื่อจากหน้าบัญชีของคุณ สิทธิ์การรับชมจะอยู่ถึงวันสุดท้ายของรอบบิลที่จ่ายไว้แล้ว',
  },
  {
    q: 'ดูพร้อมกันได้กี่เครื่อง',
    a: 'FREE 1 เครื่อง, STANDARD 2 เครื่อง และ PREMIUM สูงสุด 4 เครื่องพร้อมกัน',
  },
  {
    q: 'รองรับอุปกรณ์อะไรบ้าง',
    a: 'รองรับเว็บเบราว์เซอร์ มือถือทั้ง iOS และ Android แท็บเล็ต สมาร์ททีวี และกล่องสตรีมมิงทั่วไป',
  },
  {
    q: 'ไลฟ์สดดูย้อนหลังได้ไหม',
    a: 'ไลฟ์ส่วนใหญ่ดูย้อนหลังได้ทันทีหลังจบรายการ สมาชิก PREMIUM ดูย้อนหลังได้นานถึง 30 วัน',
  },
]

export const RECENT_SEARCHES = [
  'บ่วงรักมายา',
  'หนังแอ็กชันไทย',
  'คดีลับหมายเลข 7',
  'ไลฟ์เกม',
  'คอนเสิร์ต 2026',
]

export const TRENDING_SEARCHES = [
  'เพลิงพยัคฆ์',
  'ละครใหม่ 2026',
  'DUDI Originals',
  'รหัสลับพญานาค',
  'ยุทธการปล้นกลางกรุง',
  'ป้าแจ๋วพาชิม',
  'ซีรีส์สืบสวน',
  'หนังผีไทย',
  'เกมโชว์',
  'ทายาทตระกูลเสือ',
]

export const SEARCH_TABS = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'movie', label: 'หนัง' },
  { id: 'drama', label: 'ละคร' },
  { id: 'series', label: 'ซีรีส์' },
  { id: 'show', label: 'รายการ' },
  { id: 'live', label: 'LIVE' },
  { id: 'creator', label: 'ครีเอเตอร์' },
] as const

/* ----------------------------------------- Signed-in mock profile */
export const PROFILE = {
  name: 'ณัฐชนก ธนวัฒน์',
  email: 'natchanok@example.com',
  avatarSeed: 'profile-natchanok',
  memberSince: 'สมาชิกตั้งแต่ มีนาคม 2567',
  plan: 'PREMIUM',
  planPrice: '149 บาท / เดือน',
  renewDate: '14 ตุลาคม 2569',
  devices: 3,
  maxDevices: 4,
  profiles: [
    { id: 'p1', name: 'ณัฐชนก', seed: 'profile-natchanok', kind: 'ผู้ใหญ่' },
    { id: 'p2', name: 'ปันปัน', seed: 'profile-punpun', kind: 'เด็ก' },
    { id: 'p3', name: 'บ้านคุณแม่', seed: 'profile-mom', kind: 'ผู้ใหญ่' },
  ],
}

export const ACCOUNT_SECTIONS = [
  { id: 'profile', label: 'โปรไฟล์', icon: 'user' },
  { id: 'subscription', label: 'แพ็กเกจของฉัน', icon: 'crown' },
  { id: 'history', label: 'ประวัติการรับชม', icon: 'history' },
  { id: 'mylist', label: 'รายการของฉัน', icon: 'bookmark' },
  { id: 'settings', label: 'การตั้งค่า', icon: 'settings' },
] as const

export const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'คดีลับหมายเลข 7 · EP5 มาแล้ว',
    body: 'ตอนใหม่พร้อมให้รับชมสำหรับสมาชิก PREMIUM',
    time: '12 นาทีที่แล้ว',
    seed: 'sr-khadi-lap-7-art',
    unread: true,
  },
  {
    id: 'n2',
    title: 'พี่หมีเกมเมอร์กำลังไลฟ์อยู่',
    body: 'ดันแรงก์ข้ามคืน! ภารกิจขึ้นท็อป 100 ของประเทศ',
    time: '1 ชม.ที่แล้ว',
    seed: 'live-bear-rank',
    unread: true,
  },
  {
    id: 'n3',
    title: 'เพลิงพยัคฆ์ เข้าฉายแล้ววันนี้',
    body: 'ภาพยนตร์แอ็กชันฟอร์มยักษ์ รับชมได้แล้วในระบบ',
    time: 'เมื่อวาน',
    seed: 'mv-plerng-phayak-art',
    unread: false,
  },
]

export const FOOTER_LINKS = [
  {
    title: 'สำรวจ',
    links: [
      { label: 'หน้าแรก', to: '/' },
      { label: 'หนัง', to: '/movies' },
      { label: 'หมวดหมู่', to: '/category' },
      { label: 'ไลฟ์สด', to: '/live' },
    ],
  },
  {
    title: 'บัญชี',
    links: [
      { label: 'เข้าสู่ระบบ', to: '/login' },
      { label: 'แพ็กเกจ', to: '/pricing' },
      { label: 'บัญชีของฉัน', to: '/account' },
      { label: 'ค้นหา', to: '/search' },
    ],
  },
  {
    title: 'ช่วยเหลือ',
    links: [
      { label: 'ศูนย์ช่วยเหลือ', to: '/pricing' },
      { label: 'อุปกรณ์ที่รองรับ', to: '/pricing' },
      { label: 'ติดต่อเรา', to: '/pricing' },
      { label: 'แจ้งปัญหา', to: '/pricing' },
    ],
  },
]
