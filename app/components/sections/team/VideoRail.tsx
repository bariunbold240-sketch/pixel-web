'use client'

import { useState } from 'react'
import { YOUTUBE_POSTER_CHAIN, youtubeEmbedUrl, youtubePoster, youtubeThumbnail } from '@/lib/youtube'
import { GRAIN_SVG } from './grain'

// Scaled-down echo of the hero card's treatment in TeamSection — same pink
// halo and inset hairlines, dialled back so a 130px thumbnail doesn't glow
// louder than the 500px poster it sits beside.
const CARD_SHADOW = [
  'inset 0 0 0 1px rgba(255,255,255,0.04)',
  'inset 0 1px 0 rgba(255,255,255,0.06)',
  '0 0 30px rgba(255,79,216,0.16)',
  '0 0 60px rgba(255,79,216,0.07)',
  '0 12px 30px rgba(0,0,0,0.5)',
].join(', ')

export interface TeamVideo {
  id: number
  youtubeId: string
  title: string
}

// Facade pattern: the poster is a plain <img> and the YouTube iframe is only
// mounted for the card the visitor actually clicks. Embedding every video up
// front would pull in the full player (several hundred KB and its own timers)
// on a panel that most visitors scroll straight past.
function VideoCard({
  video,
  playing,
  onPlay,
  fill,
}: {
  video: TeamVideo
  playing: boolean
  onPlay: () => void
  fill: boolean
}) {
  // Walks YOUTUBE_POSTER_CHAIN as each candidate 404s.
  const [posterStep, setPosterStep] = useState(0)
  const posterSrc = fill ? youtubePoster(video.youtubeId, posterStep) : youtubeThumbnail(video.youtubeId)

  return (
    <div className={fill ? 'shrink-0 h-full snap-start' : 'shrink-0'}>
      <div
        className={`relative w-full overflow-hidden ${fill ? 'h-full' : 'aspect-video'}`}
        style={{
          borderRadius: '18px',
          background: 'rgba(5,6,16,0.72)',
          border: '1px solid rgba(255,79,216,0.2)',
          boxShadow: CARD_SHADOW,
        }}
      >
        {playing ? (
          <iframe
            src={youtubeEmbedUrl(video.youtubeId)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={video.title}
            className="group absolute inset-0 w-full h-full cursor-pointer border-0 p-0 bg-transparent"
          >
            <img
              src={posterSrc}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setPosterStep((s) => Math.min(s + 1, YOUTUBE_POSTER_CHAIN.length - 1))}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
            <span
              className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-70"
              style={{ background: 'linear-gradient(180deg, rgba(5,6,16,0.1) 0%, rgba(5,6,16,0.55) 100%)' }}
            />
            {/* Hover-only play affordance. touch-visible keeps it on phones,
                which have no hover to reveal it with. */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="touch-visible flex items-center justify-center rounded-full
                           opacity-0 scale-90 transition-[opacity,transform] duration-250 ease-out
                           group-hover:opacity-100 group-hover:scale-100"
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#05060f" aria-hidden="true">
                  <polygon points="6 4 20 12 6 20" />
                </svg>
              </span>
            </span>
          </button>
        )}

        {/* Hero-card accents, poster state only — an overlay on top of a live
            iframe would tint the video and swallow the player's controls. */}
        {!playing && (
          <>
            <div
              className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,79,216,0.55) 50%, transparent 95%)' }}
            />
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px', opacity: 0.03, mixBlendMode: 'overlay' }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default function VideoRail({
  videos,
  variant,
  heading,
}: {
  videos: TeamVideo[]
  variant: 'rail' | 'strip'
  heading: string
}) {
  const [playingId, setPlayingId] = useState<number | null>(null)

  if (videos.length === 0) return null

  // Desktop: vertical column to the left of the hero, mirroring the thumbnail
  // rail on the right. Mobile: horizontal scroller, matching the photo strip
  // already below the hero.
  // From xl up this splits the viewer down the middle with the hero: both
  // halves are flex-1 basis-0, so the video and the poster get the same slice
  // of the row. Below xl it stays a narrow fixed rail — an even split there
  // would starve the hero card, which derives its width from its height.
  if (variant === 'rail') {
    return (
      <div className="hidden lg:flex flex-col gap-2.5 min-w-0 w-58 shrink-0 xl:w-auto xl:flex-1 xl:basis-0 xl:shrink">
        {/* Mirrors the counter row on the right-hand thumbnail rail: label,
            hairline, tally. A "current / total" pair would be a lie here —
            nothing is selected until a visitor presses play — so this is a
            plain count in the same mono face. */}
        <div className="shrink-0 flex items-center justify-between gap-3">
          <span
            className="font-mono text-[11px] uppercase whitespace-nowrap"
            style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em' }}
          >
            {heading}
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,79,216,0.15)' }} />
          <span
            className="font-mono text-[11px] tabular-nums"
            style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em' }}
          >
            {String(videos.length).padStart(2, '0')}
          </span>
        </div>

        {/* Every card is the full height of the column, so it always matches
            the hero poster beside it. With more than one video the column
            becomes a one-at-a-time scroller rather than a stack of thumbnails —
            the only way each card can keep that height. */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-5 snap-y snap-mandatory">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              playing={playingId === video.id}
              onPlay={() => setPlayingId(video.id)}
              fill
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex lg:hidden flex-col gap-2 mt-3 shrink-0">
      <span
        className="font-mono text-[10px] uppercase"
        style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em' }}
      >
        {heading}
      </span>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-0.5">
        {videos.map((video) => (
          <div key={video.id} className="w-47 shrink-0">
            <VideoCard
              video={video}
              playing={playingId === video.id}
              onPlay={() => setPlayingId(video.id)}
              fill={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
