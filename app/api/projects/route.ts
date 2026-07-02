import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resolvePublicAsset } from '@/lib/project-assets'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rawProjects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  const projects = await Promise.all(
    rawProjects.map(async (project) => ({
      ...project,
      image: await resolvePublicAsset(project.image),
    })),
  )

  return NextResponse.json(projects)
}
