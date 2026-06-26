import type React from 'react'

export const tilt = {
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.transform = `perspective(800px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-5px)`
  },
  onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  },
}
