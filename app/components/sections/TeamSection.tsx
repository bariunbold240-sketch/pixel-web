'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSectionAnim } from '../useSectionAnim'
import TypewriterText from '../TypewriterText'
import { useLang } from '../../context/LangContext'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E")`

const DEFAULT_PHOTOS = [
  '/photo_2026-06-26_12-48-06.jpg',
  '/photo_2026-06-26_12-48-08.jpg',
  '/photo_2026-06-26_12-48-11.jpg',
  '/photo_2026-06-26_12-48-12.jpg',
  '/photo_2026-06-26_12-48-15.jpg',
  '/photo_2026-06-26_12-48-18.jpg',
  '/photo_2026-06-26_12-48-19.jpg',
  '/photo_2026-06-26_12-48-22.jpg',
  '/photo_2026-06-26_12-48-27.jpg',
  '/photo_2026-06-26_13-33-21.jpg',
]

// ─── Floating nav arrow ────────────────────────────────────────────────────
// Hit area (w-11 h-11 = 44px, WCAG 2.5.8) is intentionally larger than the
// visible circle (w-10 h-10 = 40px) — the inner span carries all the visual
// styling unchanged, so rendered pixels are identical on every breakpoint.
function NavArrow({
  dir,
  onClick,
}: {
  dir: 'prev' | 'next'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Өмнөх' : 'Дараах'}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full
                  flex items-center justify-center cursor-pointer border-0 bg-transparent p-0
                  ${dir === 'prev' ? 'left-1' : 'right-1'}`}
    >
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200 hover:scale-110 active:scale-90"
        style={{
          background: 'rgba(255,79,216,0.07)',
          border: '1px solid rgba(255,79,216,0.28)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '22px',
          lineHeight: 1,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.35), 0 0 12px rgba(255,79,216,0.12)',
        }}
      >
        {dir === 'prev' ? '‹' : '›'}
      </span>
    </button>
  )
}

// ─── Thumbnail cell ────────────────────────────────────────────────────────
// Shared leaf markup for both the desktop rail and the mobile/tablet strip —
// the two containers differ enough in information architecture to stay
// separate (see TeamSection below), but the repeated cell rendering doesn't.
interface ThumbnailCellProps {
  photo: string
  index: number
  active: boolean
  onClick: () => void
  variant: 'rail' | 'strip'
  btnRef?: (el: HTMLButtonElement | null) => void
}

function ThumbnailCell({ photo, index, active, onClick, variant, btnRef }: ThumbnailCellProps) {
  const isRail = variant === 'rail'

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      aria-label={`Зураг ${index + 1}`}
      aria-pressed={isRail ? active : undefined}
      className={`group relative flex-none overflow-hidden cursor-pointer border-0 p-0 bg-transparent ${
        isRail ? 'w-full' : 'h-16'
      }`}
      style={
        isRail
          ? {
              aspectRatio: '1/1',
              borderRadius: '10px',
              outline: active ? '1.5px solid rgba(255,79,216,0.9)' : '1.5px solid rgba(255,79,216,0.1)',
              outlineOffset: '2px',
              boxShadow: active ? '0 0 22px rgba(255,79,216,0.42), 0 0 8px rgba(255,79,216,0.25)' : 'none',
              opacity: active ? 1 : 0.4,
              transition: 'outline 0.28s, box-shadow 0.28s, opacity 0.28s',
            }
          : {
              aspectRatio: '1/1',
              borderRadius: '10px',
              outline: active ? '1.5px solid rgba(255,79,216,0.88)' : '1.5px solid transparent',
              outlineOffset: '2px',
              boxShadow: active ? '0 0 16px rgba(255,79,216,0.4)' : 'none',
              opacity: active ? 1 : 0.36,
              transition: 'all 0.28s ease',
            }
      }
    >
      {/* Glass backing — visible before image loads (rail only, matches original) */}
      {isRail && (
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'rgba(10,12,28,0.9)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        />
      )}
      <img
        src={photo}
        alt=""
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover ${
          isRail ? 'z-10 transition-transform duration-300 ease-out group-hover:scale-[1.06]' : ''
        }`}
        style={isRail ? { transform: active ? 'scale(1.06)' : undefined } : undefined}
      />
      {isRail && (
        <>
          {/* Active pink tint */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(255,79,216,0.14) 0%, transparent 55%)', opacity: active ? 1 : 0 }}
          />
          {/* Hover brightening */}
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
        </>
      )}
    </button>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────
interface TeamSectionProps {
  active: boolean
  sectionRef: (el: HTMLElement | null) => void
}

export default function TeamSection({ active, sectionRef }: TeamSectionProps) {
  const innerRef   = useSectionAnim(active)
  const { lang } = useLang()
  const mn = lang === 'mn'
  const [idx, setIdx] = useState(0)
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS)
  const imgRefs    = useRef<(HTMLImageElement | null)[]>([])
  const prevIdxRef = useRef(0)
  const thumbRefs  = useRef<(HTMLButtonElement | null)[]>([])
  const swipeRef   = useRef<{ x: number; y: number } | null>(null)
  const totalPhotos = photos.length

  const go   = useCallback((i: number) => setIdx(i), [])
  const prev = useCallback(() => setIdx(i => (i - 1 + totalPhotos) % totalPhotos), [totalPhotos])
  const next = useCallback(() => setIdx(i => (i + 1) % totalPhotos), [totalPhotos])

  useEffect(() => {
    let cancelled = false

    async function loadGalleryPhotos() {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' })
        if (!res.ok) return

        const data = await res.json() as Array<{ src?: string | null }>
        const nextPhotos = data
          .map((photo) => photo.src?.trim() ?? '')
          .filter((src): src is string => src.length > 0)

        if (cancelled || nextPhotos.length === 0) return

        setPhotos(nextPhotos)
        setIdx((current) => Math.min(current, nextPhotos.length - 1))
      } catch {
        // Keep the built-in fallback gallery if the API is unavailable.
      }
    }

    void loadGalleryPhotos()

    return () => {
      cancelled = true
    }
  }, [])

  // GSAP crossfade on slide change
  useEffect(() => {
    const p = prevIdxRef.current
    if (p === idx) return
    import('gsap').then(({ default: gsap }) => {
      const from = imgRefs.current[p]
      const to   = imgRefs.current[idx]
      if (from) gsap.to(from, { opacity: 0, scale: 0.96, duration: 0.26, ease: 'power2.in', overwrite: true })
      if (to)   gsap.fromTo(to, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.44, ease: 'power3.out', delay: 0.05, overwrite: true })
    })
    prevIdxRef.current = idx
  }, [idx])

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    thumbRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [idx])

  return (
    <section className={`panel${active ? ' active' : ''}`} ref={sectionRef}>

      {/* ── Background glow ── */}
      <div
        className="glow-orb"
        style={{ width: 'clamp(400px,95vw,760px)', height: 'clamp(400px,95vw,760px)', top: '-20%', right: '-10%', background: 'radial-gradient(circle, rgba(255,79,216,0.14) 0%, transparent 60%)' }}
      />
      <div
        className="glow-orb"
        style={{ width: 'clamp(280px,70vw,480px)', height: 'clamp(280px,70vw,480px)', bottom: '-8%', left: '-8%', background: 'radial-gradient(circle, rgba(111,99,255,0.1) 0%, transparent 60%)' }}
      />

      <div
        ref={innerRef}
        className="panel-inner h-full w-full flex flex-col max-w-[1440px] mx-auto
                   px-[clamp(28px,6vw,96px)] pt-20 md:pt-[clamp(72px,9vh,100px)] pb-8"
      >

        {/* ── Header ── */}
        <div data-anim className="shrink-0 mb-5 md:mb-6">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="block w-6 h-px" style={{ background: 'rgba(255,79,216,0.52)' }} />
            <p
              className="text-[9px] tracking-[0.46em] uppercase font-semibold"
              style={{ color: 'rgba(255,79,216,0.62)' }}
            >
              <TypewriterText text={mn ? '03 / Туршлага' : '03 / Experience'} active={active} speed={22} delay={100} />
            </p>
          </div>
          <h2 className="text-[clamp(28px,4.2vw,60px)] font-black uppercase leading-[0.87] tracking-[-0.03em]">
            <TypewriterText text={mn ? 'Бидний ' : 'Our '} active={active} speed={45} delay={320} />
            <em className="gradient-text not-italic">
              <TypewriterText text={mn ? 'Туршлага' : 'Experience'} active={active} speed={55} delay={650} />
            </em>
          </h2>
        </div>

        {/* ── Viewer ── */}
        <div data-anim data-no-hover className="flex-1 min-h-[300px] md:min-h-0 flex gap-5 items-stretch">

          {/*
            Hero ZONE — takes remaining width, centers the card.
            Horizontal padding creates space for the floating arrows.
            The card itself derives width from height × aspect-ratio (portrait).
          */}
          {/* Horizontal swipes flip slides on touch devices; vertical swipes
              fall through to normal page scrolling. Desktop is unaffected. */}
          <div
            className="relative flex-1 min-h-0 flex items-center justify-center px-3 lg:px-14"
            onTouchStart={(e) => {
              const t = e.touches[0]
              swipeRef.current = { x: t.clientX, y: t.clientY }
            }}
            onTouchEnd={(e) => {
              const start = swipeRef.current
              swipeRef.current = null
              if (!start) return
              const t = e.changedTouches[0]
              const dx = t.clientX - start.x
              const dy = t.clientY - start.y
              if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return
              if (dx < 0) next()
              else prev()
            }}
          >

            <NavArrow dir="prev" onClick={prev} />

            {/*
              Hero card — aspect-ratio: 4/5 makes it portrait so it hugs
              the poster. height fills the zone; width is auto-derived.
            */}
            <div
              className="team-hero-card relative overflow-hidden w-full lg:w-auto lg:h-full"
              style={{
                aspectRatio: '1/1',
                maxWidth: 'min(90vw, 520px)',
                borderRadius: '28px',
                background: 'rgba(5, 6, 16, 0.72)',
                border: '1px solid rgba(255,79,216,0.2)',
                boxShadow: [
                  'inset 0 0 0 1px rgba(255,255,255,0.04)',
                  'inset 0 1px 0 rgba(255,255,255,0.06)',
                  '0 0  60px rgba(255,79,216,0.22)',
                  '0 0 120px rgba(255,79,216,0.10)',
                  '0 0 200px rgba(255,79,216,0.05)',
                  '0 32px 80px rgba(0,0,0,0.7)',
                ].join(', '),
              }}
            >
              {/* Stacked images — GSAP drives opacity & scale */}
              {photos.map((photo, i) => (
                <img
                  key={i}
                  ref={(el) => { imgRefs.current[i] = el }}
                  src={photo}
                  alt=""
                  decoding="async"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
              ))}

              {/* Decorative window chrome dots */}
              <div className="absolute top-3.5 left-4 z-30 flex items-center gap-[5px] pointer-events-none">
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,79,216,0.65)', boxShadow: '0 0 8px rgba(255,79,216,0.55)' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(111,99,255,0.5)' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
              </div>

              {/* Top edge glow line */}
              <div
                className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,79,216,0.55) 50%, transparent 95%)' }}
              />

              {/* Film grain */}
              <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px', opacity: 0.038, mixBlendMode: 'overlay' }}
              />
            </div>

            <NavArrow dir="next" onClick={next} />
          </div>

          {/* ── Right panel: counter + thumbnails + dots (desktop only) ── */}
          <div className="hidden lg:flex flex-col w-36 shrink-0 gap-2.5">

            {/* Counter */}
            <div className="shrink-0 flex items-center justify-between">
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em' }}
              >
                {String(idx + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(totalPhotos).padStart(2, '0')}
              </span>
              <div className="h-px flex-1 ml-3" style={{ background: 'rgba(255,79,216,0.15)' }} />
            </div>

            {/* Thumbnail list */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2">
              {photos.map((photo, i) => (
                <ThumbnailCell
                  key={i}
                  variant="rail"
                  photo={photo}
                  index={i}
                  active={i === idx}
                  onClick={() => go(i)}
                  btnRef={(el) => { thumbRefs.current[i] = el }}
                />
              ))}
            </div>

            {/* Pagination dots */}
            <div className="shrink-0 flex flex-col items-center gap-1.5 py-2">
              {photos.map((_, i) => {
                const on = i === idx
                return (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Зураг ${i + 1}`}
                    className="flex-none cursor-pointer border-0 p-0 bg-transparent"
                    style={{
                      width: on ? 5 : 4,
                      height: on ? 18 : 4,
                      borderRadius: on ? '3px' : '50%',
                      background: on ? '#ff4fd8' : 'rgba(255,79,216,0.2)',
                      boxShadow: on ? '0 0 10px rgba(255,79,216,0.72), 0 0 4px rgba(255,79,216,0.42)' : 'none',
                      transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Mobile/tablet slide counter ── */}
        <div className="flex lg:hidden items-center justify-center gap-3 mt-3 shrink-0">
          <div className="h-px w-8" style={{ background: 'rgba(255,79,216,0.25)' }} />
          <span className="font-mono text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
            {String(idx + 1).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}
          </span>
          <div className="h-px w-8" style={{ background: 'rgba(255,79,216,0.25)' }} />
        </div>

        {/* ── Mobile/tablet thumbnail strip ── */}
        <div className="flex lg:hidden mt-3 gap-2 overflow-x-auto no-scrollbar shrink-0 pb-0.5">
          {photos.map((photo, i) => (
            <ThumbnailCell
              key={i}
              variant="strip"
              photo={photo}
              index={i}
              active={i === idx}
              onClick={() => go(i)}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <div
          className="mt-4 pt-4 flex items-center justify-between shrink-0"
          style={{ borderTop: '1px solid rgba(111,99,255,0.16)' }}
        >
          <span className="section-num">03 / 06</span>
          <span
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(184,194,221,0.26)' }}
          >
            {mn ? 'Туршлага' : 'Experience'}
          </span>
        </div>
      </div>
    </section>
  )
}
