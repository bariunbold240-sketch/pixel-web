import { prisma } from '@/lib/db'
import ProjectsManager from './ProjectsManager'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const raw = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = raw as any[]
  return <ProjectsManager initialProjects={projects} />
}
