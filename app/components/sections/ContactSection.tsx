'use client'

import { contactPhone } from '../../data/siteContent'
import { useSectionAnim } from '../useSectionAnim'

const SOCIALS = [
  { label: 'Facebook',  href: '#', icon: 'f' },
  { label: 'Instagram', href: '#', icon: '▲' },
  { label: 'LinkedIn',  href: '#', icon: 'in' },
  { label: 'Behance',   href: '#', icon: 'Bē' },
]

interface ContactSectionProps {
  active: boolean
  sectionRef: (el: HTMLElement | null) => void
}

export default function ContactSection({ active, sectionRef }: ContactSectionProps) {
  const innerRef = useSectionAnim(active)

  return (
    <section className={`panel${active ? ' active' : ''}`} ref={sectionRef}>

      {/* Glow orbs */}
      <div className="glow-orb w-[550px] h-[550px] top-[-15%] right-[-5%]"
        style={{ background: 'radial-gradient(circle, rgba(111,99,255,0.2) 0%, transparent 70%)' }} />
      <div className="glow-orb w-[350px] h-[350px] bottom-[5%] left-[-5%]"
        style={{ background: 'radial-gradient(circle, rgba(255,79,216,0.16) 0%, transparent 70%)' }} />

      <div ref={innerRef} className="panel-inner h-full w-full flex flex-col max-w-[1440px] mx-auto
                      px-[clamp(28px,6vw,96px)] pt-20 md:pt-[clamp(72px,9vh,100px)] pb-8">

        {/* Header */}
        <div className="mb-8">
          <p data-anim className="text-[11px] font-bold tracking-[0.22em] uppercase text-hot mb-3">
            06 — Холбоо Барих
          </p>
          <h2 data-anim className="text-[clamp(30px,4vw,56px)] font-black uppercase leading-[0.9] tracking-[-0.02em]">
            Холбоо <span className="gradient-text">Барих</span>
          </h2>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 md:flex-1 md:min-h-0">

          {/* LEFT — location card */}
          <div data-anim className="glass-card rounded-2xl relative overflow-hidden flex flex-col">

            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg,rgba(111,99,255,0.7),rgba(255,79,216,0.7),transparent)' }} />

            {/* Map grid background */}
            <div className="absolute inset-0"
              style={{ opacity: 0.055, backgroundImage: 'repeating-linear-gradient(0deg,rgba(111,99,255,1) 0,rgba(111,99,255,1) 1px,transparent 1px,transparent 38px), repeating-linear-gradient(90deg,rgba(111,99,255,1) 0,rgba(111,99,255,1) 1px,transparent 1px,transparent 38px)' }} />

            {/* Radial pin glow */}
            <div className="absolute pointer-events-none"
              style={{ top: '42%', left: '50%', transform: 'translate(-50%,-50%)', width: 380, height: 380, background: 'radial-gradient(circle, rgba(255,79,216,0.18) 0%, transparent 65%)' }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 gap-6">

              {/* Top: label + city name */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2"
                  style={{ color: 'rgba(184,194,221,0.45)' }}>
                  Бидний байршил
                </p>
                <h3 className="text-[clamp(28px,3.2vw,48px)] font-black uppercase leading-none tracking-[-0.02em]">
                  Улаанбаатар
                </h3>
                <p className="gradient-text text-[clamp(14px,1.4vw,20px)] font-black uppercase tracking-[0.06em] mt-1">
                  Mongolia
                </p>
              </div>

              {/* Center: satellite map image */}
              <div className="flex-1 relative min-h-40 rounded-xl overflow-hidden">
                {/* Satellite photo */}
                <img
                  src="/map-location.jpg"
                  alt="Байршил"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark tint overlay to match theme */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(5,5,20,0.45) 0%, rgba(5,5,20,0.2) 50%, rgba(5,5,20,0.55) 100%)' }} />
                {/* Brand color tint */}
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(111,99,255,0.08) 0%, transparent 70%)', mixBlendMode: 'screen' }} />

                {/* Pin marker at center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1 drop-shadow-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{
                        background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)',
                        boxShadow: '0 0 24px rgba(255,79,216,0.7), 0 0 8px rgba(111,99,255,0.5)',
                      }}>
                      📍
                    </div>
                    <div className="w-3 h-1 rounded-full"
                      style={{ background: 'rgba(255,79,216,0.6)', filter: 'blur(2px)' }} />
                  </div>
                </div>

                {/* Coordinate chips */}
                <div className="absolute top-2 left-3 px-2 py-0.5 rounded-md text-[9px] font-mono backdrop-blur-sm"
                  style={{ background: 'rgba(5,5,20,0.65)', border: '1px solid rgba(111,99,255,0.35)', color: 'rgba(184,194,221,0.8)' }}>
                  47°55′N
                </div>
                <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-md text-[9px] font-mono backdrop-blur-sm"
                  style={{ background: 'rgba(5,5,20,0.65)', border: '1px solid rgba(255,79,216,0.3)', color: 'rgba(184,194,221,0.8)' }}>
                  106°55′E
                </div>

                {/* Street label */}
                <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md text-[9px] font-semibold backdrop-blur-sm"
                  style={{ background: 'rgba(5,5,20,0.65)', border: '1px solid rgba(111,99,255,0.2)', color: 'rgba(184,194,221,0.7)' }}>
                  UNESCO St 62
                </div>
              </div>

              {/* Bottom: address + hours */}
              <div className="flex flex-col gap-3">
                <div className="h-px"
                  style={{ background: 'linear-gradient(90deg,rgba(111,99,255,0.35),transparent)' }} />

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5"
                      style={{ color: 'rgba(184,194,221,0.45)' }}>Хаяг</p>
                    <p className="text-[clamp(13px,1.1vw,15px)] text-pxwhite font-semibold">
                      UNESCO St 62, СБД-1 хороо, УБ 14230
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider mb-0.5"
                      style={{ color: 'rgba(184,194,221,0.45)' }}>Ажлын цаг</p>
                    <p className="text-[clamp(13px,1.1vw,15px)] text-pxwhite font-semibold">
                      Да–Ба &nbsp;09:00–18:00
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                    <span className="text-[11px] font-semibold"
                      style={{ color: '#4ade80' }}>Нээлттэй</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=UNESCO+St+62,+SBD-1+Khoroo,+Ulaanbaatar+14230,+Mongolia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold transition-colors duration-200 hover:text-hot"
                    style={{ color: 'rgba(184,194,221,0.5)' }}
                  >
                    Google Maps-д нээх →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — contact details + social */}
          <div className="flex flex-col gap-4">

            {/* Contact details */}
            <div data-anim className="glass-card rounded-2xl p-6 flex flex-col gap-5 flex-1">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ color: 'rgba(184,194,221,0.45)' }}>
                Холбоо барих
              </p>

              {[
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6f63ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/>
                    </svg>
                  ),
                  label: 'Утас', value: contactPhone, color: '#6f63ff',
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4fd8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  ),
                  label: 'И-мэйл', value: 'hello@pixel.mn', color: '#ff4fd8',
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15a59a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: 'Хаяг', value: 'UNESCO St 62, СБД-1, УБ 14230', color: '#15a59a',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: `${item.color}1a`, border: `1px solid ${item.color}30` }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5"
                      style={{ color: 'rgba(184,194,221,0.45)' }}>
                      {item.label}
                    </p>
                    <p className="text-[clamp(13px,1.1vw,14px)] text-pxwhite font-medium">{item.value}</p>
                  </div>
                </div>
              ))}

              {/* CTA button */}
              <a
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="mt-auto w-full py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider text-center cursor-pointer border-0 transition-opacity duration-250 hover:opacity-90 no-underline"
                style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 8px 28px rgba(111,99,255,0.3)', display: 'block' }}
              >
                Залгах →
              </a>
            </div>

            {/* Social icons */}
            <div data-anim className="glass-card rounded-2xl p-5">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                style={{ color: 'rgba(184,194,221,0.45)' }}>
                Сошиал хаяг
              </p>
              <div className="grid grid-cols-4 gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer
                               transition-all duration-250 hover:scale-105 group"
                    style={{ background: 'rgba(111,99,255,0.08)', border: '1px solid rgba(111,99,255,0.15)' }}
                  >
                    <span className="text-[13px] font-black text-pxwhite/60 group-hover:text-hot transition-colors">
                      {s.icon}
                    </span>
                    <span className="text-[9px] text-mute/40 uppercase tracking-wider">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-line/30 flex items-center justify-between">
          <span className="section-num">06 / 06</span>
          <p className="text-[10px] text-mute/35 text-center">
            © 2025 PIXEL Social Media Mongolia. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <span className="text-[10px] text-mute/40 uppercase tracking-[0.18em]">Холбоо Барих</span>
        </div>
      </div>
    </section>
  )
}
