import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import VideosManager from './VideosManager'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Бичлэгүүд' }

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { order: 'asc' } })
  return <VideosManager initialVideos={videos} />
}
