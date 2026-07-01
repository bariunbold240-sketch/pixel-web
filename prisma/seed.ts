import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

// ── Admin user ─────────────────────────────────────────────────────────────
async function seedAdmin() {
  const email    = process.env.ADMIN_EMAIL    ?? 'admin@pixel.mn'
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!'

  if (await prisma.user.findUnique({ where: { email } })) {
    console.log(`  ✓ Admin already exists: ${email}`)
    return
  }
  const hash = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { email, password: hash, role: 'ADMIN' } })
  console.log(`  ✓ Admin created: ${email}`)
}

// ── Gallery photos (03 / Харилцаа section) ────────────────────────────────
const PHOTOS = [
  '/photo_2026-06-26_12-48-06.jpg',
  '/photo_2026-06-26_12-48-08.jpg',
  '/photo_2026-06-26_12-48-11.jpg',
  '/photo_2026-06-26_12-48-12.jpg',
  '/photo_2026-06-26_12-48-15.jpg',
  '/photo_2026-06-26_12-48-18.jpg',
  '/photo_2026-06-26_12-48-19.jpg',
  '/photo_2026-06-26_12-48-22.jpg',
  '/photo_2026-06-26_12-48-27.jpg',
  '/photo_2026-06-26_13-33-21.jpg',
]

async function seedPhotos() {
  const count = await prisma.galleryPhoto.count()
  if (count > 0) {
    console.log(`  ✓ Gallery photos already seeded (${count})`)
    return
  }
  await prisma.galleryPhoto.createMany({
    data: PHOTOS.map((src, i) => ({ src, order: i })),
  })
  console.log(`  ✓ Gallery photos seeded: ${PHOTOS.length}`)
}

// ── Tech icons (Бүтээгдэхүүн section) ────────────────────────────────────
const ICONS = [
  { src: '/icon/icon1.png', label: 'Car Care'  },
  { src: '/icon/icon2.png', label: 'Badal'     },
  { src: '/icon/icon3.png', label: 'GymHub'    },
  { src: '/icon/icon4.png', label: 'Nova Mind' },
  { src: '/icon/icon5.png', label: 'Bluebell'  },
]

async function seedIcons() {
  const count = await prisma.techIcon.count()
  if (count > 0) {
    console.log(`  ✓ Tech icons already seeded (${count})`)
    return
  }
  await prisma.techIcon.createMany({
    data: ICONS.map((icon, i) => ({ ...icon, order: i })),
  })
  console.log(`  ✓ Tech icons seeded: ${ICONS.length}`)
}

// ── Packages (05 / Багц section) ──────────────────────────────────────────
const PACKAGES = [
  { name: 'Pixel Smart',   price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '2' }, { label: 'FB IG постер', value: '7' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '—' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '—' }, { label: 'App', value: '—' }] },
  { name: 'Pixel Core',    price: '', featured: true,  features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '10' }, { label: 'FB IG постер', value: '15' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '1' }, { label: 'График дизайны ажил', value: '10' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '1' }, { label: 'App', value: '1' }] },
  { name: 'Pixel Basic',   price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '3' }, { label: 'FB IG постер', value: '9' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '—' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '—' }, { label: 'App', value: '—' }] },
  { name: 'Pixel Early',   price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '1' }, { label: 'FB IG постер', value: '5' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '—' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '—' }, { label: 'App', value: '—' }] },
  { name: 'Pixel Premium', price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '8' }, { label: 'FB IG постер', value: '13' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '—' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '—' }, { label: 'App', value: '—' }] },
  { name: 'Pixel Total',   price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '5' }, { label: 'FB IG постер', value: '10' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '—' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '—' }, { label: 'App', value: '—' }] },
  { name: 'Pixel Elite',   price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '7' }, { label: 'FB IG постер', value: '12' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '—' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '—' }, { label: 'App', value: '—' }] },
  { name: 'Pixel Apex',    price: '', featured: false, features: [{ label: 'Календарчилсан төлөвлөгөө', value: '1' }, { label: 'Зах зээлийн судалгаа', value: '1' }, { label: 'Рийл бичлэг', value: '9' }, { label: 'FB IG постер', value: '14' }, { label: 'Fb Cover, Profile', value: '1' }, { label: 'Тайлан', value: '1' }, { label: 'Зураг авалт', value: '—' }, { label: 'График дизайны ажил', value: '5' }, { label: 'Chat bot', value: '1' }, { label: 'Web сайт', value: '1' }, { label: 'App', value: '—' }] },
]

async function seedPackages() {
  const count = await prisma.package.count()
  if (count > 0) { console.log(`  ✓ Packages already seeded (${count})`); return }
  await prisma.package.createMany({
    data: PACKAGES.map((p, i) => ({ ...p, order: i })),
  })
  console.log(`  ✓ Packages seeded: ${PACKAGES.length}`)
}

// ── Projects (Төслүүд admin page) ─────────────────────────────────────────
const PROJECTS = [
  { name: 'GYMHUB Фитнесс',        status: 'Идэвхтэй',    members: 6932, color: '#15a59a' },
  { name: 'NOVA MIND Acadем',      status: 'Идэвхтэй',    members: 420,  color: '#6f63ff' },
  { name: 'BLUEBELL Цэцэгхан',    status: 'Хянаж байна', members: 118,  color: '#ff4fd8' },
  { name: 'Модон Гэрийн Тавилга', status: 'Дууссан',     members: 890,  color: '#1e6fd4' },
]

async function seedProjects() {
  const count = await prisma.project.count()
  if (count > 0) { console.log(`  ✓ Projects already seeded (${count})`); return }
  await prisma.project.createMany({
    data: PROJECTS.map((p, i) => ({ ...p, order: i })),
  })
  console.log(`  ✓ Projects seeded: ${PROJECTS.length}`)
}

// ── Run ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('Seeding database...')
  await seedAdmin()
  await seedPhotos()
  await seedIcons()
  await seedPackages()
  await seedProjects()
  console.log('Done.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
