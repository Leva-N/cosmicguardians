'use client'

import { useState } from 'react'

type Props = { gameName: string; score?: number }

export function ShareResult({ gameName, score }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.origin + '/games' : ''
    const text = score != null
      ? `Мой результат в ${gameName}: ${score} очков! Играй тут: ${url}`
      : `Играю в ${gameName} на Cosmic Guardians. Попробуй: ${url}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${gameName} — Cosmic Guardians`,
          text,
          url,
        })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        copyFallback(text)
      }
    } else {
      copyFallback(text)
    }
  }

  const copyFallback = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#8A2BE2]/20 px-4 py-2 text-sm font-medium text-[#8A2BE2] transition-colors hover:bg-[#8A2BE2]/30 hover:border-[#8A2BE2]/50"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied ? 'Скопировано!' : 'Поделиться результатом'}
    </button>
  )
}
