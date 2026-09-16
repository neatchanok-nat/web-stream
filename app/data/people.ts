import type { Person } from '~/types'

/* Entirely fictional performers — any resemblance to real artists is
   unintended. Used to populate cast lists across the catalog. */
const ACTORS = [
  'ภาคิน วรรณกิจ',
  'ชญานิศ ปิ่นแก้ว',
  'ธีร์ อริยะวงศ์',
  'พิมพ์มาดา สุขเจริญ',
  'กันตพงศ์ ไชยรัตน์',
  'ณัฐรดา บุญช่วย',
  'วรินทร ศรีสุพรรณ',
  'อรชพร เทพนิมิตร',
  'ปัณณวิชญ์ โสมนัส',
  'ญาดา คีรีวงศ์',
  'สรวิชญ์ ธนาวุฒิ',
  'เขมิกา อุดมสิน',
  'ภูริช สกุลทอง',
  'ปรียานุช ดาวเรือง',
  'อนาวิล เจริญพงษ์',
  'มนัสนันท์ แสงทวี',
  'จิรัฏฐ์ พันธ์เพชร',
  'ศิรดา วงศ์วิริยะ',
  'ธนกฤต ลิ่มสกุล',
  'ปาลิตา ชัยมงคล',
  'กฤตภาส เรืองฤทธิ์',
  'นลินทิพย์ อ่อนละมุน',
  'ชนาธิป เมืองแมน',
  'ภัทรานิษฐ์ กุลสิริ',
]

const CHARACTERS = [
  'รับบท เมฆ',
  'รับบท ปราง',
  'รับบท ต้นน้ำ',
  'รับบท ขวัญ',
  'รับบท ราชันย์',
  'รับบท แพรวา',
  'รับบท สายฟ้า',
  'รับบท มณีจันทร์',
  'รับบท โดม',
  'รับบท ใบเตย',
  'รับบท ผู้กองชล',
  'รับบท คุณหญิงเรไร',
  'รับบท เสือดำ',
  'รับบท นางเอกลูกทุ่ง',
  'รับบท หมอกานต์',
  'รับบท ทับทิม',
]

const DIRECTORS = [
  'เอกรัฐ พิริยะกุล',
  'ชลดา แสงตะวัน',
  'ธนดล วิเชียรชัย',
  'พัชรพร นครชัย',
  'วิทวัส กมลรัตน์',
]

function seedNum(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Deterministic cast list for a title id. */
export function makeCast(id: string, count = 6): Person[] {
  const base = seedNum(id)
  const people: Person[] = []
  for (let i = 0; i < count; i++) {
    const nameIdx = (base + i * 7 + i * i) % ACTORS.length
    const charIdx = (base + i * 11) % CHARACTERS.length
    people.push({
      id: `${id}-p${i}`,
      name: ACTORS[nameIdx] as string,
      role: CHARACTERS[charIdx] as string,
    })
  }
  people.push({
    id: `${id}-dir`,
    name: DIRECTORS[base % DIRECTORS.length] as string,
    role: 'ผู้กำกับ',
  })
  return people
}
