import type { ContentKind, Title } from '~/types'
import { makeCast } from './people'

/* ============================================================
   DUDI — Fictional catalogue
   20 movies · 15 dramas · 8 series · 10 shows
   All titles, synopses and artwork are original inventions.
   ============================================================ */

interface Draft {
  id: string
  title: string
  titleEn?: string
  tagline?: string
  synopsis: string
  year: number
  rating: string
  runtime?: number
  episodes?: number
  seasons?: number
  genres: string[]
  tier?: 'free' | 'premium'
  score: number
  badges?: string[]
}

function build(kind: ContentKind, drafts: Draft[]): Title[] {
  return drafts.map((d) => ({
    kind,
    tier: 'free',
    ...d,
    isPremium: (d.tier ?? 'free') === 'premium',
    isLive: false,
    cast: makeCast(d.id),
    artSeed: `${d.id}-art`,
    backdropSeed: `${d.id}-backdrop`,
    trailerLength: `${1 + (d.id.length % 3)}:${(20 + (d.id.length * 7) % 40).toString().padStart(2, '0')}`,
  })) as Title[]
}

/* ------------------------------------------------------------ MOVIES */
export const MOVIES: Title[] = build('movie', [
  {
    id: 'mv-plerng-phayak',
    title: 'เพลิงพยัคฆ์',
    titleEn: 'Tiger Flame',
    tagline: 'ภาพยนตร์แอ็กชันฟอร์มยักษ์',
    synopsis:
      'อดีตหน่วยรบพิเศษที่ผันตัวเป็นครูมวยในต่างจังหวัด ต้องหวนคืนสังเวียนอีกครั้ง เมื่อขบวนการค้าอาวุธข้ามชาติลากครอบครัวของเขาเข้าไปพัวพัน การล่าครั้งสุดท้ายจึงเริ่มต้นขึ้นบนถนนที่เขาเคยหนีจากมัน',
    year: 2026,
    rating: 'น 15+',
    runtime: 128,
    genres: ['แอ็กชัน', 'ระทึกขวัญ'],
    tier: 'premium',
    score: 8.4,
    badges: ['ใหม่ล่าสุด'],
  },
  {
    id: 'mv-la-sen-tai',
    title: 'ล่าเส้นตาย',
    titleEn: 'Deadline Hunt',
    synopsis:
      'นักข่าวอาชญากรรมได้รับคลิปปริศนาที่นับถอยหลังสู่การฆาตกรรมครั้งต่อไป เธอมีเวลา 12 ชั่วโมงในการไขปมก่อนที่ชื่อของตัวเองจะขึ้นเป็นรายถัดไป',
    year: 2025,
    rating: 'น 18+',
    runtime: 112,
    genres: ['ระทึกขวัญ', 'สืบสวน'],
    tier: 'premium',
    score: 8.1,
  },
  {
    id: 'mv-rak-nai-man-fon',
    title: 'รักในม่านฝน',
    titleEn: 'Love Behind the Rain',
    synopsis:
      'ช่างซ่อมร่มในตลาดเก่ากับนักเปียโนที่สูญเสียการได้ยิน พบกันในฤดูฝนที่ยาวนานที่สุดของเชียงใหม่ และค้นพบว่าความเงียบก็มีทำนองของมัน',
    year: 2025,
    rating: 'ท',
    runtime: 105,
    genres: ['โรแมนติก', 'ดราม่า'],
    score: 8.6,
    badges: ['รางวัลผู้ชม'],
  },
  {
    id: 'mv-ngao-nai-soi',
    title: 'เงาในซอยเปลี่ยว',
    titleEn: 'The Alley',
    synopsis:
      'ครอบครัวหนึ่งย้ายเข้าตึกแถวเก่ากลางเมือง แล้วพบว่าเงาที่ทอดอยู่ปลายซอยไม่เคยขยับตามแสงไฟ',
    year: 2025,
    rating: 'น 18+',
    runtime: 98,
    genres: ['สยองขวัญ'],
    tier: 'premium',
    score: 7.5,
  },
  {
    id: 'mv-bangkok-night-rider',
    title: 'บางกอกไนต์ไรเดอร์',
    titleEn: 'Bangkok Night Rider',
    tagline: 'ความเร็วคือคำตอบเดียว',
    synopsis:
      'ไรเดอร์ส่งของกลางคืนรับงานพิเศษที่จ่ายหนักผิดปกติ แลกกับการวิ่งข้ามเมืองภายในคืนเดียว โดยไม่รู้ว่ากล่องพัสดุในมือคือกุญแจของสงครามใต้ดิน',
    year: 2026,
    rating: 'น 15+',
    runtime: 118,
    genres: ['แอ็กชัน', 'ดราม่า'],
    tier: 'premium',
    score: 8.2,
    badges: ['มาแรง'],
  },
  {
    id: 'mv-hua-jai-mai-mee-wan',
    title: 'หัวใจไม่มีวันหมดอายุ',
    titleEn: 'Never Expired',
    synopsis:
      'เจ้าของร้านสะดวกซื้อวัยเกษียณตัดสินใจออกตามหารักครั้งแรกเมื่อ 40 ปีก่อน พร้อมหลานสาวผู้ไม่เชื่อเรื่องความรักเป็นคนขับรถ',
    year: 2024,
    rating: 'ท',
    runtime: 110,
    genres: ['คอมเมดี้', 'ดราม่า'],
    score: 8.0,
  },
  {
    id: 'mv-mon-rak-cyber',
    title: 'มนต์รักลูกทุ่งไซเบอร์',
    titleEn: 'Cyber Country Love',
    synopsis:
      'หมอลำสาวจากอีสานกลายเป็นไวรัลข้ามคืน เมื่อ AI นำเสียงของเธอไปทำเพลง เธอจึงต้องพิสูจน์ว่าเสียงจริงของคนยังมีค่ากว่า',
    year: 2025,
    rating: 'ท',
    runtime: 102,
    genres: ['คอมเมดี้', 'เพลง'],
    score: 7.8,
  },
  {
    id: 'mv-phiseua-klang-payu',
    title: 'ผีเสื้อกลางพายุ',
    titleEn: 'Butterfly in the Storm',
    synopsis:
      'เรื่องราวของพยาบาลสาวในโรงพยาบาลชายแดน ที่ต้องเลือกระหว่างคำสั่งกับชีวิตคนตรงหน้า ในคืนที่พายุพัดถล่มหนักที่สุดในรอบศตวรรษ',
    year: 2024,
    rating: 'น 13+',
    runtime: 124,
    genres: ['ดราม่า'],
    tier: 'premium',
    score: 8.8,
    badges: ['คำวิจารณ์ยอดเยี่ยม'],
  },
  {
    id: 'mv-nak-suep-sai-mu',
    title: 'นักสืบสายมู',
    titleEn: 'The Lucky Detective',
    synopsis:
      'นักสืบเอกชนที่ตัดสินใจทุกคดีด้วยการเสี่ยงเซียมซี บังเอิญไขคดีใหญ่ที่สุดของกรุงเทพฯ ได้ถูกต้องทุกครั้ง จนตำรวจเริ่มสงสัยว่าเขาอาจไม่ได้เดา',
    year: 2025,
    rating: 'น 13+',
    runtime: 106,
    genres: ['คอมเมดี้', 'สืบสวน'],
    score: 7.9,
  },
  {
    id: 'mv-pathapee-plerng',
    title: 'ปฐพีเพลิง',
    titleEn: 'Land of Embers',
    tagline: 'มหากาพย์แฟนตาซีไทย',
    synopsis:
      'เมื่อภูเขาไฟที่หลับใหลมากว่าพันปีเริ่มหายใจอีกครั้ง เด็กหนุ่มผู้ถือกำเนิดจากเถ้าถ่านต้องรวบรวมสี่ธาตุเพื่อปิดผนึกอสูรที่ถูกปลุก',
    year: 2026,
    rating: 'น 13+',
    runtime: 142,
    genres: ['แฟนตาซี', 'แอ็กชัน'],
    tier: 'premium',
    score: 8.5,
    badges: ['ใหม่ล่าสุด'],
  },
  {
    id: 'mv-kuen-tee-dao-lon',
    title: 'คืนที่ดาวหล่น',
    titleEn: 'The Night Stars Fell',
    synopsis:
      'สองคนแปลกหน้าติดอยู่บนดาดฟ้าเดียวกันในคืนฝนดาวตก และมีเวลาเพียงหนึ่งคืนก่อนชีวิตจะพาแยกกันไปคนละทิศ',
    year: 2024,
    rating: 'ท',
    runtime: 96,
    genres: ['โรแมนติก'],
    score: 8.3,
  },
  {
    id: 'mv-lued-suphan-2569',
    title: 'ศึกบางระกำ 2569',
    titleEn: 'Bang Rakam Rising',
    synopsis:
      'จินตนิยายอิงประวัติศาสตร์ในเมืองสมมุติ เมื่อลูกหลานช่างตีดาบต้องรวมพลชาวบ้านต้านกองทัพรับจ้างที่หมายยึดสายน้ำของทั้งหุบเขา',
    year: 2025,
    rating: 'น 15+',
    runtime: 136,
    genres: ['แอ็กชัน', 'ดราม่า'],
    tier: 'premium',
    score: 8.0,
  },
  {
    id: 'mv-rongrian-tong-sap',
    title: 'โรงเรียนต้องสาป',
    titleEn: 'Cursed Class',
    synopsis:
      'นักเรียนห้อง ม.6/8 ค้นพบสมุดเช็กชื่อเก่าที่มีชื่อของพวกเขาเขียนไว้ตั้งแต่ปี 2512 และทุกคนที่ถูกขีดฆ่าก็เริ่มหายไปทีละคน',
    year: 2025,
    rating: 'น 18+',
    runtime: 101,
    genres: ['สยองขวัญ', 'ระทึกขวัญ'],
    score: 7.6,
  },
  {
    id: 'mv-sut-thang-rak',
    title: 'สุดทางรัก',
    titleEn: 'End of the Line',
    synopsis:
      'พนักงานขับรถไฟสายเหนือเที่ยวสุดท้ายของยุคดีเซล เดินทางเที่ยวปิดตำนาน พร้อมผู้โดยสารเจ็ดคนที่ต่างมีเรื่องค้างคาใจต้องสะสาง',
    year: 2024,
    rating: 'น 13+',
    runtime: 115,
    genres: ['ดราม่า'],
    score: 8.4,
  },
  {
    id: 'mv-ai-num-motorcy',
    title: 'ไอ้หนุ่มวินมอเตอร์ไซค์',
    titleEn: 'King of the Soi',
    synopsis:
      'วินหัวซอยผู้รู้ทุกทางลัดในกรุงเทพฯ รับพนันว่าจะพาเจ้าสาวไปถึงงานแต่งให้ทันในชั่วโมงเร่งด่วนที่รถติดที่สุดของปี',
    year: 2025,
    rating: 'ท',
    runtime: 94,
    genres: ['คอมเมดี้', 'แอ็กชัน'],
    score: 7.7,
  },
  {
    id: 'mv-asurakai-mueang-krung',
    title: 'อสุรกายเมืองกรุง',
    titleEn: 'City of Fangs',
    synopsis:
      'ใต้รางรถไฟฟ้าสายใหม่ มีบางอย่างตื่นขึ้นพร้อมการก่อสร้าง และมันเลือกล่าเฉพาะคนที่ทำงานกะดึก',
    year: 2026,
    rating: 'น 18+',
    runtime: 108,
    genres: ['สยองขวัญ', 'แฟนตาซี'],
    tier: 'premium',
    score: 7.9,
    badges: ['มาแรง'],
  },
  {
    id: 'mv-yutthakan-plon',
    title: 'ยุทธการปล้นกลางกรุง',
    titleEn: 'The Grand Heist',
    synopsis:
      'ทีมนักต้มตุ๋นหกคนวางแผนปล้นตู้เซฟใต้ดินของตึกที่สูงที่สุดในเมือง ระหว่างงานเคานต์ดาวน์ที่มีคนดูสิบล้านคนทั่วประเทศ',
    year: 2026,
    rating: 'น 15+',
    runtime: 121,
    genres: ['แอ็กชัน', 'คอมเมดี้'],
    tier: 'premium',
    score: 8.3,
    badges: ['มาแรง'],
  },
  {
    id: 'mv-ruedu-tee-chan-kid',
    title: 'ฤดูที่ฉันคิดถึงเธอ',
    titleEn: 'The Season I Miss You',
    synopsis:
      'จดหมายที่ไม่เคยถูกส่งจำนวน 52 ฉบับ ถูกพบในตู้ล็อกเกอร์เก่า และพาเด็กสาวย้อนกลับไปหาฤดูร้อนที่เธอพยายามลืม',
    year: 2024,
    rating: 'ท',
    runtime: 99,
    genres: ['โรแมนติก', 'ดราม่า'],
    score: 8.5,
  },
  {
    id: 'mv-thep-jao-khun-khao',
    title: 'เทพเจ้าแห่งขุนเขา',
    titleEn: 'Guardian of the Ridge',
    synopsis:
      'นักปีนเขาหลงทางในหุบเขาที่ไม่มีอยู่ในแผนที่ และได้พบกับผู้เฝ้ารักษาที่ยอมให้เขากลับลงไปได้ แลกกับความทรงจำหนึ่งอย่าง',
    year: 2025,
    rating: 'น 13+',
    runtime: 117,
    genres: ['แฟนตาซี', 'ดราม่า'],
    tier: 'premium',
    score: 8.1,
  },
  {
    id: 'mv-sen-tai-sut-thai',
    title: 'เส้นตายสุดท้าย',
    titleEn: 'Final Cut',
    synopsis:
      'ผู้กำกับหนังที่กำลังจะหมดอนาคต ได้ทุนสร้างก้อนสุดท้าย แต่ต้องถ่ายทำในคฤหาสน์ที่ทีมงานชุดก่อนไม่มีใครได้กลับออกมา',
    year: 2026,
    rating: 'น 18+',
    runtime: 104,
    genres: ['ระทึกขวัญ', 'สยองขวัญ'],
    score: 7.8,
    badges: ['ใหม่ล่าสุด'],
  },
])

/* ------------------------------------------------------------ DRAMAS */
export const DRAMAS: Title[] = build('drama', [
  {
    id: 'dr-buang-rak',
    title: 'บ่วงรักมายา',
    tagline: 'ละครหลังข่าวที่คนทั้งประเทศพูดถึง',
    synopsis:
      'ทายาทตระกูลใหญ่แต่งงานกับหญิงสาวที่เขาเชื่อว่าเป็นคนทำลายครอบครัว โดยไม่รู้ว่าความแค้นที่ถืออยู่นั้นถูกวางไว้ตั้งแต่ต้น',
    year: 2026,
    rating: 'น 13+',
    episodes: 24,
    seasons: 1,
    genres: ['ดราม่า', 'โรแมนติก'],
    tier: 'premium',
    score: 8.7,
    badges: ['อันดับ 1'],
  },
  {
    id: 'dr-sailap-hua-jai',
    title: 'สายลับหัวใจสีชมพู',
    synopsis:
      'สายลับหญิงต้องแฝงตัวเป็นแม่บ้านในคฤหาสน์ของผู้ต้องสงสัย แต่ภารกิจเริ่มสั่นคลอนเมื่อเธอเริ่มเชื่อว่าเขาบริสุทธิ์',
    year: 2025,
    rating: 'น 13+',
    episodes: 18,
    genres: ['โรแมนติก', 'คอมเมดี้'],
    score: 8.2,
  },
  {
    id: 'dr-manee-lued',
    title: 'มณีเลือด',
    synopsis:
      'อัญมณีประจำตระกูลที่ส่งต่อกันมาห้าชั่วคน นำโชคลาภมาให้เสมอ แลกกับชีวิตหนึ่งในทุกรุ่น',
    year: 2025,
    rating: 'น 15+',
    episodes: 20,
    genres: ['ดราม่า', 'ลึกลับ'],
    tier: 'premium',
    score: 8.5,
  },
  {
    id: 'dr-saphai-rai-sak',
    title: 'สะใภ้ไร้ศักดิ์',
    synopsis: 'ลูกสะใภ้จากต่างจังหวัดต้องพิสูจน์ตัวเองในบ้านที่ทุกคนรอให้เธอล้มเหลว',
    year: 2024,
    rating: 'น 13+',
    episodes: 22,
    genres: ['ดราม่า'],
    score: 8.0,
  },
  {
    id: 'dr-roi-kaen',
    title: 'รอยแค้นแรงริษยา',
    synopsis:
      'พี่น้องต่างมารดาที่เติบโตมาคนละโลก กลับมาพบกันอีกครั้งในวันอ่านพินัยกรรมที่เปลี่ยนทุกอย่าง',
    year: 2025,
    rating: 'น 15+',
    episodes: 26,
    genres: ['ดราม่า'],
    tier: 'premium',
    score: 8.3,
  },
  {
    id: 'dr-duang-jai-nai-mok',
    title: 'ดวงใจในสายหมอก',
    synopsis: 'หมอหนุ่มอาสาไปประจำสถานีอนามัยบนดอย และได้พบครูสาวที่เก็บความลับของทั้งหมู่บ้านไว้',
    year: 2024,
    rating: 'ท',
    episodes: 16,
    genres: ['โรแมนติก', 'ดราม่า'],
    score: 8.4,
  },
  {
    id: 'dr-phleng-rak-chao-phraya',
    title: 'เพลงรักริมเจ้าพระยา',
    synopsis: 'วงดนตรีไทยเดิมที่กำลังจะยุบวง ได้นักร้องลูกครึ่งหัวรั้นมาเป็นความหวังสุดท้าย',
    year: 2025,
    rating: 'ท',
    episodes: 14,
    genres: ['โรแมนติก', 'เพลง'],
    score: 8.1,
  },
  {
    id: 'dr-thayat-sua',
    title: 'ทายาทตระกูลเสือ',
    synopsis: 'ธุรกิจขนส่งเก่าแก่ถูกส่งต่อให้ลูกชายคนเล็กที่ไม่เคยอยากรับ ในวันที่ศัตรูล้อมรอบทุกด้าน',
    year: 2026,
    rating: 'น 15+',
    episodes: 20,
    genres: ['ดราม่า', 'แอ็กชัน'],
    tier: 'premium',
    score: 8.6,
    badges: ['มาแรง'],
  },
  {
    id: 'dr-khun-chai-rai-ngao',
    title: 'คุณชายไร้เงา',
    synopsis: 'คฤหาสน์ริมน้ำที่มีกระจกทุกบานถูกคลุมผ้า เพราะเจ้าของบ้านไม่มีเงาสะท้อนมาสามสิบปีแล้ว',
    year: 2025,
    rating: 'น 15+',
    episodes: 18,
    genres: ['ลึกลับ', 'โรแมนติก'],
    tier: 'premium',
    score: 8.2,
  },
  {
    id: 'dr-sanya-rak-lanthom',
    title: 'สัญญารักใต้ต้นลั่นทม',
    synopsis: 'คำสัญญาในวัยเด็กใต้ต้นลั่นทมกลายเป็นพันธนาการ เมื่อทั้งคู่กลับมาเจอกันในฐานะคู่แข่งทางธุรกิจ',
    year: 2024,
    rating: 'ท',
    episodes: 16,
    genres: ['โรแมนติก'],
    score: 7.9,
  },
  {
    id: 'dr-pom-rak-pom-kaen',
    title: 'ปมรักปมแค้น',
    synopsis: 'คดีฆาตกรรมเมื่อ 20 ปีก่อนถูกรื้อขึ้นมาใหม่ และพยานปากเดียวคือคนที่เธอรักที่สุด',
    year: 2025,
    rating: 'น 15+',
    episodes: 24,
    genres: ['ดราม่า', 'สืบสวน'],
    score: 8.3,
  },
  {
    id: 'dr-maekha-khon-suay',
    title: 'แม่ค้าคนสวยกับนายตำรวจ',
    synopsis: 'แม่ค้าตลาดนัดจอมจุ้นกับนายตำรวจหน้าใหม่ ร่วมมือกันสาวถึงแก๊งฟอกเงินในย่านเก่า',
    year: 2026,
    rating: 'ท',
    episodes: 14,
    genres: ['คอมเมดี้', 'โรแมนติก'],
    score: 8.0,
    badges: ['ใหม่ล่าสุด'],
  },
  {
    id: 'dr-wiman-fai',
    title: 'วิมานไฟ',
    synopsis: 'โรงแรมหรูกลางเมืองที่ซ่อนบัญชีดำของคนมีอำนาจไว้ทั้งเมือง กำลังจะถูกเผาโดยคนในบ้านเอง',
    year: 2025,
    rating: 'น 18+',
    episodes: 22,
    genres: ['ดราม่า', 'ระทึกขวัญ'],
    tier: 'premium',
    score: 8.5,
  },
  {
    id: 'dr-rak-nee-tong-pisut',
    title: 'รักนี้ต้องพิสูจน์',
    synopsis: 'คู่รักที่ตกลงหย่าอย่างสงบ ต้องอยู่บ้านเดียวกันอีก 90 วันตามเงื่อนไขพินัยกรรมของคุณยาย',
    year: 2024,
    rating: 'ท',
    episodes: 12,
    genres: ['โรแมนติก', 'คอมเมดี้'],
    score: 7.8,
  },
  {
    id: 'dr-hua-jai-sila',
    title: 'หัวใจศิลา',
    synopsis: 'ประติมากรผู้ไม่เคยยิ้มมาสิบปี รับงานปั้นรูปเหมือนของหญิงสาวที่หายตัวไปอย่างลึกลับ',
    year: 2026,
    rating: 'น 13+',
    episodes: 16,
    genres: ['ดราม่า', 'ลึกลับ'],
    tier: 'premium',
    score: 8.4,
  },
])

/* ------------------------------------------------------------ SERIES */
export const SERIES: Title[] = build('series', [
  {
    id: 'sr-khadi-lap-7',
    title: 'คดีลับหมายเลข 7',
    tagline: 'ออริจินัลซีรีส์สืบสวนจาก DUDI',
    synopsis:
      'ตำรวจกองปราบที่ถูกลดขั้น ได้รับมอบหมายให้เคลียร์คดีค้างเก่าเจ็ดคดี แล้วพบว่าทั้งเจ็ดโยงถึงคนคนเดียวกัน',
    year: 2026,
    rating: 'น 18+',
    episodes: 8,
    seasons: 2,
    genres: ['สืบสวน', 'ระทึกขวัญ'],
    tier: 'premium',
    score: 8.9,
    badges: ['ORIGINAL'],
  },
  {
    id: 'sr-mueang-maya',
    title: 'เมืองมายา',
    synopsis: 'เบื้องหลังวงการบันเทิงไทยผ่านสายตาผู้จัดการดาราหน้าใหม่ ที่ต้องเลือกระหว่างชื่อเสียงกับความจริง',
    year: 2025,
    rating: 'น 15+',
    episodes: 10,
    genres: ['ดราม่า'],
    tier: 'premium',
    score: 8.5,
    badges: ['ORIGINAL'],
  },
  {
    id: 'sr-chan-13',
    title: 'ชั้น 13',
    synopsis: 'ออฟฟิศกลางเมืองที่ลิฟต์ไม่เคยหยุดที่ชั้น 13 จนกระทั่งพนักงานใหม่กดปุ่มนั้นโดยบังเอิญ',
    year: 2025,
    rating: 'น 18+',
    episodes: 8,
    genres: ['ระทึกขวัญ', 'สยองขวัญ'],
    score: 8.2,
  },
  {
    id: 'sr-rahat-lap-phaya-nak',
    title: 'รหัสลับพญานาค',
    synopsis: 'นักโบราณคดีสาวตามรอยจารึกริมโขง และพบว่าตำนานที่เล่าต่อกันมาเป็นแผนที่ของบางอย่างที่ยังมีชีวิต',
    year: 2026,
    rating: 'น 13+',
    episodes: 12,
    genres: ['แฟนตาซี', 'ผจญภัย'],
    tier: 'premium',
    score: 8.6,
    badges: ['ใหม่ล่าสุด'],
  },
  {
    id: 'sr-hong-chao-9',
    title: 'ห้องเช่าหมายเลข 9',
    synopsis: 'อพาร์ตเมนต์ราคาถูกผิดปกติย่านชานเมือง มีกฎเพียงข้อเดียว คือห้ามเปิดประตูหลังเที่ยงคืน',
    year: 2024,
    rating: 'น 18+',
    episodes: 8,
    genres: ['สยองขวัญ'],
    score: 7.9,
  },
  {
    id: 'sr-dek-serve-supstar',
    title: 'เด็กเสิร์ฟหัวใจซุปตาร์',
    synopsis: 'พนักงานร้านชาบูกลายเป็นคู่กรณีของนักแสดงอันดับหนึ่ง และสัญญาสงบศึกคือการแกล้งคบกันสามเดือน',
    year: 2025,
    rating: 'ท',
    episodes: 12,
    genres: ['โรแมนติก', 'คอมเมดี้'],
    score: 8.3,
  },
  {
    id: 'sr-team-la-khwam-jing',
    title: 'ทีมล่าความจริง',
    synopsis: 'ทีมข่าวเชิงสืบสวนเล็ก ๆ ที่ไล่ตามขบวนการค้าที่ดินในภาคใต้ ทั้งที่ทุกคนบอกให้หยุด',
    year: 2026,
    rating: 'น 15+',
    episodes: 10,
    genres: ['ดราม่า', 'สืบสวน'],
    tier: 'premium',
    score: 8.7,
    badges: ['ORIGINAL'],
  },
  {
    id: 'sr-prisana-muban-rang',
    title: 'ปริศนาหมู่บ้านร้าง',
    synopsis: 'หมู่บ้านที่หายไปจากแผนที่ราชการเมื่อปี 2540 กลับมาปรากฏอีกครั้งพร้อมผู้อยู่อาศัยชุดเดิม',
    year: 2025,
    rating: 'น 15+',
    episodes: 8,
    genres: ['ลึกลับ', 'ระทึกขวัญ'],
    score: 8.1,
  },
])

/* ------------------------------------------------------------ SHOWS */
export const SHOWS: Title[] = build('show', [
  {
    id: 'sh-krua-lap',
    title: 'ครัวลับฉบับบ้านบ้าน',
    synopsis: 'รายการทำอาหารที่พาเชฟมืออาชีพไปทำเมนูในครัวบ้านคนดู ด้วยวัตถุดิบที่มีอยู่ในตู้เย็นเท่านั้น',
    year: 2026,
    rating: 'ท',
    episodes: 40,
    genres: ['วาไรตี้', 'อาหาร'],
    score: 8.2,
  },
  {
    id: 'sh-game-rua-rua',
    title: 'เกมรัวๆ ท้าให้ตอบ',
    synopsis: 'เกมโชว์ความเร็วที่ผู้เข้าแข่งขันมีเวลาคิดเพียง 3 วินาทีต่อคำถาม',
    year: 2026,
    rating: 'ท',
    episodes: 52,
    genres: ['เกมโชว์'],
    score: 7.9,
    badges: ['มาแรง'],
  },
  {
    id: 'sh-supstar-tha-chim',
    title: 'ซุปตาร์ท้าชิม',
    synopsis: 'ดาราตระเวนชิมร้านเด็ดทั่วไทย พร้อมภารกิจสุดโหดก่อนจะได้กิน',
    year: 2025,
    rating: 'ท',
    episodes: 36,
    genres: ['วาไรตี้', 'อาหาร'],
    score: 8.0,
  },
  {
    id: 'sh-dudi-live-fest',
    title: 'DUDI LIVE FEST 2026',
    tagline: 'คอนเสิร์ตแห่งปี',
    synopsis: 'บันทึกการแสดงสดเต็มรูปแบบจากเทศกาลดนตรีกลางแจ้งที่รวมศิลปินไทย 24 วง',
    year: 2026,
    rating: 'ท',
    runtime: 180,
    genres: ['คอนเสิร์ต', 'เพลง'],
    tier: 'premium',
    score: 8.8,
    badges: ['ใหม่ล่าสุด'],
  },
  {
    id: 'sh-thiao-pai-kap-rao',
    title: 'เที่ยวไปกับเรา',
    synopsis: 'รายการท่องเที่ยวที่ให้คนดูโหวตจุดหมายปลายทางแบบเรียลไทม์ระหว่างออกอากาศ',
    year: 2025,
    rating: 'ท',
    episodes: 28,
    genres: ['ท่องเที่ยว', 'วาไรตี้'],
    score: 7.8,
  },
  {
    id: 'sh-khao-chao-wan-mai',
    title: 'ข่าวเช้าวันใหม่',
    synopsis: 'สรุปข่าวเช้าแบบเข้าใจง่ายใน 45 นาที พร้อมเจาะประเด็นเศรษฐกิจปากท้อง',
    year: 2026,
    rating: 'ท',
    episodes: 260,
    genres: ['ข่าว'],
    score: 7.5,
  },
  {
    id: 'sh-rong-dai-rong-dee',
    title: 'ร้องได้ร้องดี',
    synopsis: 'เวทีประกวดร้องเพลงที่กรรมการตัดสินจากเสียงล้วน ๆ โดยไม่เห็นหน้าผู้เข้าแข่งขัน',
    year: 2025,
    rating: 'ท',
    episodes: 20,
    genres: ['เกมโชว์', 'เพลง'],
    tier: 'premium',
    score: 8.4,
  },
  {
    id: 'sh-ban-nee-mee-hey',
    title: 'บ้านนี้มีเฮ',
    synopsis: 'ซิตคอมกึ่งวาไรตี้ของครอบครัวใหญ่ในตึกแถวย่านเยาวราช',
    year: 2024,
    rating: 'ท',
    episodes: 48,
    genres: ['คอมเมดี้', 'วาไรตี้'],
    score: 7.7,
  },
  {
    id: 'sh-jom-yut-khwam-ru',
    title: 'จอมยุทธ์ความรู้',
    synopsis: 'ศึกประลองความรู้ระหว่างแชมป์เก่ากับผู้ท้าชิงจากทั่วประเทศ',
    year: 2026,
    rating: 'ท',
    episodes: 32,
    genres: ['เกมโชว์'],
    score: 8.1,
  },
  {
    id: 'sh-talat-nat-dara',
    title: 'ตลาดนัดดารา',
    synopsis: 'ดาราเปิดแผงขายของมือสอง แข่งกันทำยอดเพื่อนำรายได้เข้ามูลนิธิ',
    year: 2025,
    rating: 'ท',
    episodes: 24,
    genres: ['วาไรตี้'],
    score: 7.6,
  },
])

/* ------------------------------------------------------------ AGGREGATES */
export const ALL_TITLES: Title[] = [...MOVIES, ...DRAMAS, ...SERIES, ...SHOWS]

export const TITLE_BY_ID = new Map(ALL_TITLES.map((t) => [t.id, t]))

export function getTitle(id?: string): Title | undefined {
  return id ? TITLE_BY_ID.get(id) : undefined
}

/** Stable pseudo-shuffle so rails differ without breaking SSR hydration. */
export function pickBy(list: Title[], step: number, count: number, offset = 0): Title[] {
  const out: Title[] = []
  for (let i = 0; out.length < count && i < list.length * 2; i++) {
    const item = list[(offset + i * step) % list.length]
    if (item && !out.includes(item)) out.push(item)
  }
  return out
}

export const MOVIE_GENRES = [
  'ทั้งหมด',
  'แอ็กชัน',
  'โรแมนติก',
  'ดราม่า',
  'คอมเมดี้',
  'สยองขวัญ',
  'แฟนตาซี',
] as const

export const YEARS = ['ทุกปี', '2026', '2025', '2024'] as const
export const RATINGS = ['ทุกเรตติ้ง', '8.5 ขึ้นไป', '8.0 ขึ้นไป', '7.5 ขึ้นไป'] as const
export const SORTS = ['แนะนำ', 'มาใหม่', 'คะแนนสูงสุด', 'ชื่อ ก–ฮ'] as const
