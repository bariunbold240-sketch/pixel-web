'use client'

import { useEffect, useRef } from 'react'
import Logo3D from './Logo3D'

interface LoadingScreenProps {
  onDone: () => void
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const tagRef  = useRef<HTMLParagraphElement>(null)
  const barRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const t = setTimeout(onDone, 600)
      return () => clearTimeout(t)
    }

    import('gsap').then(({ default: gsap }) => {
      // Logo3D assembly: delay 0.4s + 13 blocks × 0.08s stagger + 1.53s per block
      // → last block done at ~2.9s from mount.
      // Our timeline runs in parallel with Logo3D's own GSAP timeline.
      gsap.timeline()
        // Text rises in as first blocks start arriving
        .fromTo(textRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          0.6
        )
        // Tagline
        .fromTo(tagRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.95
        )
        // Progress bar sweeps over 2.2s — completes slightly before logo assembly
        .fromTo(barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 2.2, ease: 'power1.inOut', transformOrigin: 'left center' },
          0.4
        )
        // Hold so user sees the fully assembled logo for a beat
        .to({}, { duration: 0.45 })
        // Fade out the entire loading screen
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          onComplete: onDone,
        })
    })
  }, [onDone])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-200 flex flex-col items-center justify-center select-none"
      style={{ background: '#000' }}
    >
      {/* Ambient glow — echoes Logo3D's colors */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 480, height: 480,
          background: 'radial-gradient(circle, rgba(111,99,255,0.13) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Logo3D — cameraZ=7 fills ~67% of the 220×220 canvas */}
      <div className="relative z-10 w-55 h-55">
        <Logo3D cameraZ={7} />
      </div>

      {/* Brand name */}
      <p
        ref={textRef}
        className="relative z-10 font-heading font-black tracking-[0.18em] uppercase -mt-1"
        style={{
          fontSize: 28,
          background: 'linear-gradient(135deg, #ffffff 50%, rgba(255,255,255,0.4))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: 0,
        }}
      >
        PIXEL
      </p>

      {/* Tagline */}
      <p
        ref={tagRef}
        className="relative z-10 uppercase mt-1.5"
        style={{
          fontSize: 10,
          letterSpacing: '0.28em',
          color: 'rgba(184,194,221,0.38)',
          opacity: 0,
        }}
      >
        ЗӨВ МЭССЭЖ · ЗӨВ ЗАХ ЗЭЭЛ
      </p>

      {/* Progress bar */}
      <div
        className="relative z-10 mt-8 rounded-full overflow-hidden"
        style={{ width: 180, height: 2, background: 'rgba(111,99,255,0.14)' }}
      >
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #6f63ff, #ff4fd8)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  )
}
