'use client'

import { N } from '../data'

interface NavDotsProps {
  cur: number
  go: (n: number) => void
}

export default function NavDots({ cur, go }: NavDotsProps) {
  return (
    <div className="hidden md:flex fixed right-[clamp(16px,3vw,34px)] top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5">
      {Array.from({ length: N }, (_, i) => (
        <button
          key={i}
          onClick={() => go(i)}
          className={`dot-btn w-[11px] h-[11px] rounded-full border border-line bg-transparent cursor-pointer p-0 transition-all duration-300 relative group ${
            cur === i ? 'on' : ''
          }`}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  )
}
