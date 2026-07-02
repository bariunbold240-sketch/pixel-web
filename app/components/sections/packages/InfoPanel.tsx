'use client'

import { HeadphonesIcon, Clock, MessageCircleHeart, Phone } from 'lucide-react'

interface InfoPanelProps {
  mn: boolean
  phone: string
}

export default function InfoPanel({ mn, phone }: InfoPanelProps) {
  const items = [
    { Icon: MessageCircleHeart, label: mn ? 'Үнэгүй зөвлөгөө' : 'Free Consultation', value: mn ? 'Бидэнтэй холбогдоорой' : 'Get in touch' },
    { Icon: Phone, label: mn ? 'Утас' : 'Phone', value: phone },
    { Icon: Clock, label: mn ? 'Ажлын цаг' : 'Working Hours', value: mn ? 'Да–Ба 09:00–18:00' : 'Mon–Fri 09:00–18:00' },
    { Icon: HeadphonesIcon, label: mn ? 'Дэмжлэг' : 'Support', value: mn ? 'Хурдан хариу' : 'Fast response' },
  ]

  return (
    <div data-anim className="info-panel-grid grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-250 hover:-translate-y-0.5"
          style={{ background: 'var(--color-glass)', border: '1px solid var(--color-line)', backdropFilter: 'blur(16px)' }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(111,99,255,0.14)' }}
          >
            <item.Icon size={16} strokeWidth={2} color="#9d94ff" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider truncate" style={{ color: 'rgba(184,194,221,0.45)' }}>
              {item.label}
            </p>
            <p className="text-[12px] font-semibold text-pxwhite truncate">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
