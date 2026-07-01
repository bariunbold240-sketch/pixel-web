import { prisma } from '@/lib/db'
import IconsManager from './IconsManager'

export const dynamic = 'force-dynamic'

export default async function AdminIconsPage() {
  const icons = await prisma.techIcon.findMany({ orderBy: { order: 'asc' } })
  return <IconsManager initialIcons={icons} />
}
