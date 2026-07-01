import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public — frontend reads packages from here
export async function GET() {
  const packages = await prisma.package.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(packages)
}
