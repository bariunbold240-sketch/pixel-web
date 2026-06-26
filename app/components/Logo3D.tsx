'use client'
import { useEffect, useRef } from 'react'

// 13 blocks matching the actual PIXEL logo reference image
// 5×5 grid, center at (col 2, row 2) → 3D center (0,0)
// STEP = 0.9  →  x = (col-2)*0.9,  y = -(row-2)*0.9
const BLOCKS = [
  // Row 0 — green trio across the top
  { x: -0.9, y:  1.8, z: 0, color: '#22C55E' }, // Bright Green
  { x:  0.0, y:  1.8, z: 0, color: '#84CC16' }, // Lime
  { x:  0.9, y:  1.8, z: 0, color: '#EAB308' }, // Yellow

  // Row 1
  { x: -1.8, y:  0.9, z: 0, color: '#06B6D4' }, // Cyan
  { x:  1.8, y:  0.9, z: 0, color: '#F59E0B' }, // Amber

  // Row 2
  { x: -1.8, y:  0.0, z: 0, color: '#0891B2' }, // Deep Cyan
  { x:  0.0, y:  0.0, z: 0, color: '#A3A300' }, // Olive Yellow
  { x:  1.8, y:  0.0, z: 0, color: '#F97316' }, // Orange

  // Row 3
  { x:  1.8, y: -0.9, z: 0, color: '#EF4444' }, // Red Orange

  // Row 4
  { x: -1.8, y: -1.8, z: 0, color: '#2563EB' }, // Blue
  { x:  0.0, y: -1.8, z: 0, color: '#9333EA' }, // Purple
  { x:  0.9, y: -1.8, z: 0, color: '#EC4899' }, // Pink
  { x:  1.8, y: -1.8, z: 0, color: '#DC2626' }, // Red
] as const

const BLOCK_SIZE  = 0.8
const BLOCK_DEPTH = 0.24

export default function Logo3D({ className, cameraZ = 9 }: { className?: string; cameraZ?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animId: number
    let assemblyDone = false

    async function init(): Promise<(() => void) | undefined> {
      if (!canvas) return

      const THREE = await import('three')
      const { default: gsap } = await import('gsap')

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const w = canvas.clientWidth  || 360
      const h = canvas.clientHeight || 430

      // ── Renderer ─────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(w, h, false)
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      // LinearToneMapping preserves the exact hues from the original logo colors
      renderer.toneMapping = THREE.LinearToneMapping
      renderer.toneMappingExposure = 1.0
      renderer.outputColorSpace = THREE.SRGBColorSpace

      // ── Scene + Camera ───────────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100)
      camera.position.z = cameraZ

      // ── Lights ───────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.92))

      const key = new THREE.DirectionalLight(0xffffff, 0.55)
      key.position.set(3, 5, 5)
      key.castShadow = true
      key.shadow.mapSize.set(1024, 1024)
      key.shadow.radius = 4
      scene.add(key)

      const fill = new THREE.PointLight(0xffffff, 0.22, 30)
      fill.position.set(-4, -3, 7)
      scene.add(fill)

      // ── Group ────────────────────────────────────────────────────────
      const group = new THREE.Group()
      scene.add(group)

      // ── Meshes ───────────────────────────────────────────────────────
      const geo = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_DEPTH)

      const items = BLOCKS.map((block, i) => {
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(block.color),
          emissive: new THREE.Color(block.color),
          emissiveIntensity: 0.18,
          metalness: 0.08,
          roughness: 0.18,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true

        if (prefersReduced) {
          mesh.position.set(block.x, block.y, block.z)
        } else {
          // scatter evenly around a circle, coming in from behind
          const angle = (i / BLOCKS.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.7
          const r = 15 + Math.random() * 8
          mesh.position.set(
            Math.cos(angle) * r,
            Math.sin(angle) * r,
            -11 - Math.random() * 10,
          )
          mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
          )
        }

        group.add(mesh)
        return { mesh, block }
      })

      if (prefersReduced) assemblyDone = true

      // ── Assembly timeline ─────────────────────────────────────────────
      if (!prefersReduced) {
        const tl = gsap.timeline({
          delay: 0.4,
          onComplete: () => { assemblyDone = true },
        })

        items.forEach(({ mesh, block }, i) => {
          const t0 = i * 0.08

          tl.to(mesh.position, {
            x: block.x, y: block.y, z: block.z,
            duration: 1.1,
            ease: 'power4.out',
          }, t0)

          tl.to(mesh.rotation, {
            x: 0, y: 0, z: 0,
            duration: 0.95,
            ease: 'power3.out',
          }, t0)

          // Bounce on landing
          tl.to(mesh.scale, {
            x: 1.22, y: 1.22, z: 1.22,
            duration: 0.08,
            ease: 'power2.in',
          }, t0 + 1.0)
          tl.to(mesh.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.45,
            ease: 'elastic.out(1.5, 0.4)',
          }, t0 + 1.08)
        })
      }

      // ── Mouse parallax ───────────────────────────────────────────────
      const mouse   = { x: 0, y: 0 }
      const mSmooth = { x: 0, y: 0 }

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2
        mouse.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
      }

      // ── Hover: blocks separate one-by-one and spin individually ─────
      const PUSH = 0.72

      const onPointerEnter = () => {
        if (!assemblyDone) return
        items.forEach(({ mesh, block }, i) => {
          const stagger = i * 0.07
          const len = Math.sqrt(block.x * block.x + block.y * block.y)
          const dx  = len > 0 ? block.x / len : 0
          const dy  = len > 0 ? block.y / len : 0

          gsap.killTweensOf(mesh.position)
          gsap.killTweensOf(mesh.rotation)

          // Fly outward — staggered one by one
          gsap.to(mesh.position, {
            x: block.x + dx * PUSH,
            y: block.y + dy * PUSH,
            z: len === 0 ? 0.85 : 0.2 + Math.random() * 0.35,
            duration: 0.48,
            delay: stagger,
            ease: 'power2.out',
          })

          // Individual continuous Y-spin while separated
          gsap.to(mesh.rotation, {
            y: `+=${Math.PI * 2}`,
            duration: 0.9 + Math.random() * 0.7,
            delay: stagger,
            ease: 'none',
            repeat: -1,
          })
        })
      }

      const onPointerLeave = () => {
        if (!assemblyDone) return
        items.forEach(({ mesh, block }, i) => {
          const stagger = i * 0.055

          gsap.killTweensOf(mesh.position)
          gsap.killTweensOf(mesh.rotation)

          // Snap rotation flat
          gsap.to(mesh.rotation, {
            x: 0, y: 0, z: 0,
            duration: 0.45,
            delay: stagger,
            ease: 'power2.out',
          })

          // Fly back — elastic snap, staggered
          gsap.to(mesh.position, {
            x: block.x, y: block.y, z: block.z,
            duration: 0.85,
            delay: stagger,
            ease: 'elastic.out(1.1, 0.5)',
          })
        })
      }

      canvas.addEventListener('pointermove',  onPointerMove,  { passive: true })
      canvas.addEventListener('pointerenter', onPointerEnter)
      canvas.addEventListener('pointerleave', onPointerLeave)

      // ── Render loop ──────────────────────────────────────────────────
      let elapsed = 0
      let last    = performance.now()

      function render(now: number) {
        animId = requestAnimationFrame(render)
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        elapsed += dt

        mSmooth.x += (mouse.x - mSmooth.x) * 0.06
        mSmooth.y += (mouse.y - mSmooth.y) * 0.06

        // Camera parallax
        camera.position.x += (-mSmooth.x * 0.55 - camera.position.x) * 0.055
        camera.position.y += ( mSmooth.y * 0.38 - camera.position.y) * 0.055
        camera.lookAt(group.position)

        // Group: gentle float + slow idle rotation
        if (assemblyDone && !prefersReduced) {
          group.position.y  = Math.sin(elapsed * 0.55) * 0.1
          group.rotation.y  = Math.sin(elapsed * 0.28) * 0.07
          group.rotation.x  = Math.cos(elapsed * 0.19) * 0.032
        }

        renderer.render(scene, camera)
      }
      animId = requestAnimationFrame(render)

      // ── Resize ───────────────────────────────────────────────────────
      const ro = new ResizeObserver(() => {
        const nw = canvas.clientWidth
        const nh = canvas.clientHeight
        if (!nw || !nh) return
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh, false)
      })
      ro.observe(canvas)

      return () => {
        cancelAnimationFrame(animId)
        canvas.removeEventListener('pointermove',  onPointerMove)
        canvas.removeEventListener('pointerenter', onPointerEnter)
        canvas.removeEventListener('pointerleave', onPointerLeave)
        ro.disconnect()
        renderer.dispose()
        geo.dispose()
        items.forEach(({ mesh }) => {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose())
          } else {
            mesh.material.dispose()
          }
        })
      }
    }

    let cleanup: (() => void) | undefined
    init().then(fn => { cleanup = fn }).catch(console.error)

    return () => {
      cancelAnimationFrame(animId)
      cleanup?.()
    }
  }, [cameraZ])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
      aria-label="PIXEL animated 3D logo"
      role="img"
    />
  )
}
