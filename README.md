# DUDI (ดูดิ)

UI ต้นแบบของบริการสตรีมมิงบันเทิงไทย — ดูหนัง ละคร ซีรีส์ รายการวาไรตี้ และไลฟ์สด
สร้างด้วย **Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS v4**

เป็น **ฟรอนต์เอนด์ล้วน** — ไม่มี backend, ไม่มีการยืนยันตัวตนจริง และไม่มีการเชื่อมต่อระบบชำระเงินจริง
สถานะผู้ใช้ทั้งหมด (เซสชัน แพ็กเกจ ประวัติการดู รายการของฉัน) เก็บใน localStorage ของเบราว์เซอร์

---

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview  # ทดสอบ production build
```

## หน้าทั้งหมด

| เส้นทาง | หน้า | รายละเอียด |
| --- | --- | --- |
| `/` | หน้าแรก | Hero อัตโนมัติ + rail 8 แถว (มาแรง, ดูต่อ, ละครยอดนิยม, หนังแนะนำ, รายการบันเทิง, LIVE, ครีเอเตอร์, มาใหม่) |
| `/movies` | หนังทั้งหมด | ตัวกรองแนว/ปี/เรตติ้ง/ฟรี–Premium + เรียงลำดับ + กริดโปสเตอร์ |
| `/category` | หมวดหมู่ | แท็บ ทั้งหมด/หนัง/ละคร/ซีรีส์/รายการ/LIVE พร้อมตัวกรองและสลับความหนาแน่นกริด |
| `/live` | ไลฟ์สด | แบนเนอร์ไลฟ์แนะนำ + หมวดหมู่ + กริดไลฟ์ + ครีเอเตอร์ |
| `/live/[id]` | ดูไลฟ์ | เลย์เอาต์ 70/30 วิดีโอ + แชทสด (ข้อความไหลเข้าแบบเรียลไทม์ + รีแอคชันลอย) |
| `/movie/[id]` | รายละเอียด | Backdrop, โปสเตอร์, เมทาดาทา, รายการตอน, นักแสดง, ตัวอย่าง, เรื่องที่เกี่ยวข้อง |
| `/watch/[id]` | เล่นวิดีโอ | เพลเยอร์ OTT จำลอง + ข้อมูลวิดีโอ + แถบข้างวิดีโอที่เกี่ยวข้อง |
| `/search` | ค้นหา | ค้นหาล่าสุด, คำค้นยอดนิยม, แท็บกรองผล, ผลลัพธ์แยกตามประเภท |
| `/pricing` | แพ็กเกจ | FREE / STANDARD / PREMIUM + ตารางเปรียบเทียบ + FAQ |
| `/login` | เข้าสู่ระบบ | หน้าจอ split-screen, ปุ่มบัญชีเดโม, โซเชียลล็อกอิน (UI only) |
| `/account` | บัญชีของฉัน | โปรไฟล์, แพ็กเกจ, ประวัติการดู, รายการของฉัน, การตั้งค่า, Developer Demo |
| `/payment` | ชำระเงิน | QR / บัตรเครดิต / ทรูมันนี่ (จำลองทั้งหมด) + หน้าชำระเงินสำเร็จ |

> `/account` และ `/payment` ต้องเข้าสู่ระบบก่อน — ถ้ายังไม่ล็อกอินจะถูกส่งไป `/login?redirect=...`
> แล้วพากลับมาที่หน้าเดิมหลังเข้าสู่ระบบ

## โครงสร้างโปรเจกต์

```
app/
├─ assets/css/main.css        design tokens (สี, ฟอนต์, motion, utility)
├─ components/
│  ├─ ui/        AppButton · IconButton · AppAvatar · LiveBadge · TierBadge
│  │             ProgressBar · ToggleSwitch
│  ├─ layout/    Navbar · MobileNavbar · AppFooter · AppLogo
│  │             NotificationMenu · UserMenu
│  ├─ common/    SectionHeader · MediaRail · RecommendationRail · CategoryTabs
│  │             CategoryGrid · FilterChips · SearchBar · SortSelect
│  ├─ cards/     PosterCard · MovieCard · LandscapeCard · ContinueWatchingCard
│  │             LiveCard · CreatorCard · WideCard · RecommendationCard
│  ├─ hero/      HeroBanner
│  ├─ player/    VideoPlayer · LiveChat
│  ├─ pricing/   PricingCard
│  └─ account/   ProfileCard · AccountSidebar
├─ composables/  useMyList · useFollows  (in-memory เท่านั้น)
├─ data/         catalog · live · site · people   (mock data ทั้งหมด)
├─ layouts/      default · player · auth
├─ pages/        ทุกหน้าตามตารางด้านบน
├─ types/        โดเมนไทป์
└─ utils/        artwork (ตัวสร้างภาพ) · format (ตัวจัดรูปแบบข้อความ)
```

ตั้งค่า `components: [{ path: '~/components', pathPrefix: false }]` ไว้ใน `nuxt.config.ts`
ทุกคอมโพเนนต์จึงเรียกใช้ด้วยชื่อสั้น เช่น `<PosterCard />` โดยไม่ต้อง import

## ระบบดีไซน์

| | |
| --- | --- |
| พื้นหลัง | `#0B0B0F` (`bg-ink`) |
| พื้นผิว | `#15151D` / `#1D1D28` (`bg-surface`, `bg-surface-2`) |
| ตัวอักษร | ขาว `text-hi` · เทา `text-mid` · เทาอ่อน `text-lo` |
| สีแบรนด์ | **Iris `#7B5CFF`** ไล่ไปหา `#C065FF` — ใช้สีเดียวทั้งระบบ |
| LIVE | `#FF2D46` — สงวนไว้สำหรับตัวบ่งชี้การถ่ายทอดสดเท่านั้น |
| ฟอนต์ | Inter + IBM Plex Sans Thai (รองรับภาษาไทยเต็มรูปแบบ) |

Utility ที่สร้างเพิ่ม: `shell` (ระยะขอบหน้า), `glass` / `glass-strong`, `scrim-b` / `scrim-l`
(เกรเดียนต์ทับภาพแบบภาพยนตร์), `card-edge`, `accent-glow`, `text-gradient`, `no-scrollbar`

## ภาพประกอบ

ภาพทุกภาพในโปรเจกต์ถูก **สร้างขึ้นเองด้วยโค้ด** ที่ [`app/utils/artwork.ts`](app/utils/artwork.ts)
เป็น SVG ที่ประกอบจาก seed แบบ deterministic (seed เดิม → ภาพเดิมเสมอ จึงไม่เกิด hydration mismatch)
มี 6 องค์ประกอบภาพ (เส้นขอบฟ้าเมือง, สันเขา, ลำแสง, สปอตไลต์, คลื่น, กริดเพอร์สเปกทีฟ)
คูณกับจานสี 12 ชุด — **ไม่มีการใช้ภาพหรือแบรนด์ที่มีลิขสิทธิ์ใด ๆ และไม่มีการเรียกไฟล์จากภายนอก**

`posterArt` (2:3) · `landscapeArt` (16:9) · `backdropArt` (ไวด์สกรีน) · `wideArt` (16:10) · `avatarArt` (วงกลม)

## ข้อมูลตัวอย่าง

เนื้อหาทั้งหมดเป็นเรื่องแต่งขึ้นใหม่ ไม่อ้างอิงผลงานหรือบุคคลจริง

- ภาพยนตร์ 20 เรื่อง · ละคร 15 เรื่อง · ซีรีส์ 8 เรื่อง · รายการ 10 รายการ
- ไลฟ์สด 12 สตรีม · ครีเอเตอร์ 8 ช่อง
- รายการดูต่อ, การแจ้งเตือน, ประวัติการเรียกเก็บเงิน, แพ็กเกจ และคำค้นหายอดนิยม

## การตอบสนองต่อขนาดหน้าจอ

- **มือถือ** — แถบเมนูล่าง 5 ปุ่ม, โปสเตอร์ 2 คอลัมน์, rail เลื่อนแนวนอนพร้อม snap, แชทอยู่ใต้เพลเยอร์
- **แท็บเล็ต** — กริด 3–4 คอลัมน์, เฮดเดอร์แบบกะทัดรัดพร้อมเมนูแบบเลื่อนลง
- **เดสก์ท็อป** — เลย์เอาต์เต็มรูปแบบ, ปุ่มเลื่อน rail เมื่อวางเมาส์, เพลเยอร์ 70/30 คู่กับแชท

รองรับ `prefers-reduced-motion` และมีสถานะโฟกัสที่มองเห็นได้ทุกองค์ประกอบที่กดได้

---

## ระบบจำลอง (Mock business logic)

### localStorage

| Key | เก็บอะไร |
| --- | --- |
| `oneplay_user` | เซสชันผู้ใช้ `{ id, name, email, isLoggedIn }` |
| `oneplay_subscription` | `{ plan, status, startedAt, expiresAt, paymentMethod, owner }` |
| `oneplay_watch_history` | `[{ contentId, progress, lastWatched }]` |
| `oneplay_my_list` | `[contentId]` |

ทุกค่าจะถูกอ่านกลับหลังรีเฟรช (ผ่าน `plugins/session.client.ts`) และซิงก์ข้ามแท็บอัตโนมัติ

### การเข้าสู่ระบบ

- **เข้าสู่ระบบด้วยอีเมลใดก็ได้** → เริ่มต้นที่ **แพ็กเกจฟรี** ดูได้เฉพาะคอนเทนต์ฟรี
  ถ้าจะดูพรีเมียมต้องผ่านขั้นตอนสมัครแพ็กเกจก่อน
- **ทดลองด้วยบัญชีเดโม** → ได้แพ็กเกจ **PREMIUM** ทันที เพื่อทดลองทุกฟลว์
- แพ็กเกจผูกกับอีเมลที่ซื้อ (`owner`) — เข้าสู่ระบบด้วยบัญชีอื่นจะไม่ได้สิทธิ์ของบัญชีเดิม
- ออกจากระบบลบเฉพาะ `oneplay_user` — ข้อมูลแพ็กเกจยังอยู่ตามสเปก

### สิทธิ์การรับชม (`useAccessControl`)

| สถานะผู้ใช้ | คอนเทนต์ฟรี | หนัง/ละครพรีเมียม | ไลฟ์พรีเมียม |
| --- | --- | --- | --- |
| ผู้เยี่ยมชม | ดูได้ทันที | ไปหน้าเข้าสู่ระบบ | ไปหน้าเข้าสู่ระบบ |
| ล็อกอิน · ฟรี | ดูได้ | โมดัล "สมัครแพ็กเกจ" | โมดัล "สมัครแพ็กเกจ" |
| STANDARD | ดูได้ | ดูได้ | โมดัล "อัปเกรดเป็น PREMIUM" |
| PREMIUM | ดูได้ | ดูได้ | ดูได้ |
| หมดอายุ | ดูได้ | โมดัล "ต่ออายุแพ็กเกจ" | โมดัล "ต่ออายุแพ็กเกจ" |

การหมดอายุใช้การเทียบวันที่จริง — เมื่อเลย `expiresAt` สถานะจะกลายเป็นหมดอายุเอง
ปุ่มเล่นทุกจุดผ่าน `requestPlay()` และการเปิด URL `/watch/:id` หรือ `/live/:id` ตรง ๆ
จะเจอ `PremiumLockPanel` แทนตัวเล่นเสมอ

### Composables

`useAuth()` · `useSubscription()` · `useAccessControl()` · `useWatchHistory()` · `useMyList()`
— ตรรกะทั้งหมดอยู่ในนี้ ไม่มีการเขียนซ้ำในหน้าเพจ

### Developer Demo

อยู่ในหน้า `/account` แท็บการตั้งค่า (พับเก็บได้) — ปุ่มทดสอบ: Reset Login,
Activate Standard/Premium, Expire Subscription, Clear Watch History, Clear My List
และ Clear All LocalStorage (มีหน้าต่างยืนยันก่อนล้าง) พร้อมแสดงค่าปัจจุบันของทุกคีย์
