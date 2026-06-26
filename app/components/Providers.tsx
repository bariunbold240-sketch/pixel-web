'use client'

import { LangProvider } from '../context/LangContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>
}
