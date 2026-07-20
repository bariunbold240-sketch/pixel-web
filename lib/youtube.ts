// Any YouTube URL shape → the 11-character video id, or null when the input
// isn't a YouTube link at all. Admins paste whatever the browser gave them
// (watch, youtu.be, shorts, embed, with or without tracking params), so the
// parsing lives here rather than in the API route.
const ID_RE = /^[\w-]{11}$/
const PATH_KEYS = ['embed', 'shorts', 'live', 'v']

export function parseYoutubeId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  if (ID_RE.test(raw)) return raw

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '')
  const segments = url.pathname.split('/').filter(Boolean)

  if (host === 'youtu.be') {
    return ID_RE.test(segments[0] ?? '') ? segments[0] : null
  }

  if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'youtube-nocookie.com') {
    return null
  }

  const v = url.searchParams.get('v')
  if (v && ID_RE.test(v)) return v

  const keyIndex = segments.findIndex((s) => PATH_KEYS.includes(s))
  const candidate = keyIndex >= 0 ? segments[keyIndex + 1] : undefined
  return candidate && ID_RE.test(candidate) ? candidate : null
}

export function youtubeThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}

// True 16:9 posters, widest first. `hqdefault` is deliberately absent: it is a
// 4:3 image with the widescreen frame letterboxed inside it, so any frame that
// isn't itself 16:9 exposes the baked-in black bars. `maxresdefault` and
// `hq720` only exist for some uploads, `mqdefault` always does — hence the
// chain, walked by the card's onError handler.
export const YOUTUBE_POSTER_CHAIN = ['maxresdefault', 'hq720', 'mqdefault'] as const

export function youtubePoster(youtubeId: string, step = 0): string {
  const quality = YOUTUBE_POSTER_CHAIN[Math.min(step, YOUTUBE_POSTER_CHAIN.length - 1)]
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`
}

export function youtubeEmbedUrl(youtubeId: string): string {
  // nocookie host + no related videos from other channels.
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}
