import type { Package } from '@prisma/client'
import { prisma } from '@/lib/db'
import PackagesManager from './PackagesManager'

export const dynamic = 'force-dynamic'

interface Feature {
  label: string
  value: string
}

function normalizeFeatures(features: unknown): Feature[] {
  if (!Array.isArray(features)) return []

  return features
    .map((feature) => {
      if (!feature || typeof feature !== 'object') return null

      const candidate = feature as { label?: unknown; value?: unknown }
      if (typeof candidate.label !== 'string' || typeof candidate.value !== 'string') return null

      return {
        label: candidate.label,
        value: candidate.value,
      }
    })
    .filter((feature): feature is Feature => feature !== null)
}

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({ orderBy: { order: 'asc' } })
  const initialPackages = packages.map((pkg: Package) => ({
    ...pkg,
    features: normalizeFeatures(pkg.features),
  }))

  return <PackagesManager initialPackages={initialPackages} />
}