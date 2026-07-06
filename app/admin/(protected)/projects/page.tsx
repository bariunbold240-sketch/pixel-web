import type { Metadata } from 'next'
import type { Project } from '@prisma/client'
import { prisma } from '@/lib/db'
import { resolvePublicAsset } from '@/lib/project-assets'
import ProjectsManager from './ProjectsManager'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Төслүүд' }

export default async function AdminProjectsPage() {
  const raw = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  const projects = await Promise.all(
    raw.map(async (project: Project) => ({
      ...project,
      image: await resolvePublicAsset(project.image),
    })),
  ) as any[]
  return <ProjectsManager initialProjects={projects} />
}
