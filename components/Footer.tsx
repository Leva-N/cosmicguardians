'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <footer className="relative border-t border-[#8A2BE2]/30 bg-transparent backdrop-blur-md mt-auto">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-center">
        <Link href="/" className="flex items-center gap-1.5">
          <Image
            src="/images/hello2.png"
            alt="Cosmic Guardians"
            width={20}
            height={20}
            className="h-5 w-5 object-contain rounded-md opacity-90"
          />
          <span className="font-display text-xs font-semibold tracking-tight gradient-text">
            Cosmic Guardians | 2024-2026
          </span>
        </Link>

        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-xs font-medium text-[#8A2BE2] hover:text-[#9B4DE8] transition-colors border-0 bg-transparent cursor-pointer py-1"
            aria-expanded={open}
          >
            Bug Hunter
          </button>
          {open && (
            <div className="absolute right-0 bottom-full mb-1 py-3 px-4 min-w-[240px] rounded-xl border border-white/10 bg-[var(--bg-secondary)] shadow-xl z-50">
              <div className="flex items-start gap-3">
                <Image
                  src="/images/shedule.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <p className="text-sm text-[#8A2BE2]">
                  🐛 Found a bug or issue?{' '}
                  <a
                    href="https://x.com/LevSouth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8A2BE2] hover:text-[#9B4DE8] underline"
                  >
                    Let us know here.
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
