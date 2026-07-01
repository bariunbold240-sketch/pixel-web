'use client'

import { useEffect } from 'react'

export default function AdminScrollUnlock() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    html.dataset.admin = 'true'
    body.dataset.admin = 'true'
    return () => {
      delete html.dataset.admin
      delete body.dataset.admin
    }
  }, [])
  return null
}
