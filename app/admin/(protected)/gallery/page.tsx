import { prisma } from '@/lib/db'
import GalleryManager from './GalleryManager'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } })
  return <GalleryManager initialPhotos={photos} />
}
