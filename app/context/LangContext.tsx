'use client'

import { createContext, useContext, useState } from 'react'

export type Lang = 'mn' | 'en'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void }

const LangContext = createContext<LangCtx>({ lang: 'mn', setLang: () => {} })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('mn')
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
