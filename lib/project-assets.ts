import { access } from 'fs/promises'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const FALLBACK_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

function toPublicPath(src: string) {
  const trimmed = src.trim().replace(/\\/g, '/')
  if (!trimmed) return ''

  if (/^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

async function exists(publicPath: string) {
  const relative = publicPath.replace(/^\/+/, '')
  if (!relative) return false

  try {
    await access(path.resolve(PUBLIC_DIR, relative))
    return true
  } catch {
    return false
  }
}

export async function resolvePublicAsset(src: string | null | undefined) {
  const normalized = toPublicPath(src ?? '')
  if (!normalized) return ''

  if (/^(?:https?:)?\/\//i.test(normalized) || normalized.startsWith('data:') || normalized.startsWith('blob:')) {
    return normalized
  }

  if (await exists(normalized)) return normalized

  const parsed = path.posix.parse(normalized)
  const candidates = new Set<string>()

  for (const ext of FALLBACK_EXTS) {
    if (ext === parsed.ext) continue
    candidates.add(path.posix.join(parsed.dir, `${parsed.name}${ext}`))
  }

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }

  return normalized
}
