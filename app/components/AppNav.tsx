'use client'

import Logo3D from './Logo3D'
import { useLang } from '../context/LangContext'
import { T } from '../data/translations'

interface AppNavProps {
  cur: number
  go: (n: number) => void
}

export default function AppNav({ cur, go }: AppNavProps) {
  const { lang, setLang } = useLang()
  const t = T[lang]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 mx-auto flex items-center justify-between px-[clamp(18px,5vw,52px)] py-2">
      {/* Logo + brand name grouped together */}
      <div className="flex items-center shrink-0">
        <button
          onClick={() => go(0)}
          className="w-14 h-14 shrink-0 bg-transparent border-0 cursor-pointer p-0 flex"
          aria-label="Нүүр хуудас"
        >
          <Logo3D cameraZ={12} />
        </button>
        <p className="text-white font-serif text-xl select-none" style={{ marginLeft: 1 }}>
          PIXEL
        </p> 
      </div>

      {/* Mobile: lang toggle only */}
      <div className="flex md:hidden items-center gap-0.75 p-0.75 rounded-[10px] bg-glass border border-line">
        {(['mn', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`font-heading font-bold text-[9px] px-2.5 py-1.25 rounded-[10px] uppercase tracking-[0.06em] border-0 cursor-pointer transition-all duration-250 ${
              lang === l
                ? 'text-white [background:linear-gradient(90deg,#6f63ff,#ff4fd8)] shadow-[0_4px_14px_rgba(111,99,255,0.35)]'
                : 'text-mute bg-transparent hover:text-pxwhite'
            }`}
          >
            {l === 'mn' ? 'МН' : 'ENG'}
          </button>
        ))}
      </div>

      {/* Desktop nav links + lang toggle */}
      <div className="max-[820px]:hidden flex gap-[32px]">
        {t.nav.map((label, i) => (
          <a
            key={i}
            onClick={() => go(i + 1)}
            className={`text-xs font-semibold tracking-[0.04em] uppercase cursor-pointer transition-colors duration-[250ms] no-underline ${
              cur === i + 1 ? 'text-hot' : 'text-pxwhite/80 hover:text-pxwhite'
            }`}
          >
            {label}
          </a>
        ))}

        <div className="flex items-center -mt-[9px] gap-[3px] p-[3px] rounded-[10px] bg-glass border border-line ml-10">
          {(['mn', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`font-heading font-bold text-[9px] px-2.5 py-[5px] rounded-[10px] uppercase tracking-[0.06em] border-0 cursor-pointer transition-all duration-[250ms] ${
                lang === l
                  ? 'text-white [background:linear-gradient(90deg,#6f63ff,#ff4fd8)] shadow-[0_4px_14px_rgba(111,99,255,0.35)]'
                  : 'text-mute bg-transparent hover:text-pxwhite'
              }`}
            >
              {l === 'mn' ? 'МН' : 'ENG'}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
