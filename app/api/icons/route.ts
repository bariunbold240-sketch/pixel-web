import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resolvePublicAsset } from '@/lib/project-assets'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rawIcons = await prisma.techIcon.findMany({ orderBy: { order: 'asc' } })
  const icons = await Promise.all(
    rawIcons.map(async (icon) => ({
      ...icon,
      src: await resolvePublicAsset(icon.src),
    })),
  )

  return NextResponse.json(icons)
}
