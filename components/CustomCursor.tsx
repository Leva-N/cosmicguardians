'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

const IDLE_DELAY_MS = 180
const CURSOR_SIZE = 36
const MIN_MOVE_DIST = 3
const ROTATION_SMOOTH = 0.15

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [rotation, setRotation] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastMoveRef = useRef(0)
  const prevPosRef = useRef<{ x: number; y: number } | null>(null)
  const currentRotationRef = useRef(0)

  const handleMove = useCallback((e: MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    const prev = prevPosRef.current
    prevPosRef.current = { x, y }

    setPos({ x, y })
    setVisible(true)
    setIsMoving(true)
    lastMoveRef.current = Date.now()

    if (prev) {
      const dx = x - prev.x
      const dy = y - prev.y
      const dist = Math.hypot(dx, dy)
      if (dist >= MIN_MOVE_DIST) {
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        const current = currentRotationRef.current
        let diff = angleDeg - current
        while (diff > 180) diff -= 360
        while (diff < -180) diff += 360
        const smoothed = current + diff * ROTATION_SMOOTH
        currentRotationRef.current = smoothed
        setRotation(smoothed)
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (Date.now() - lastMoveRef.current >= IDLE_DELAY_MS) {
        setIsMoving(false)
      }
      timeoutRef.current = null
    }, IDLE_DELAY_MS)
  }, [])

  const handleLeave = useCallback(() => {
    setVisible(false)
    setIsMoving(false)
  }, [])

  useEffect(() => {
    const hasMouse = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(hasMouse)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor-active')
    window.addEventListener('mousemove', handleMove)
    document.body.addEventListener('mouseleave', handleLeave)
    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('mouseleave', handleLeave)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [enabled, handleMove, handleLeave])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
        opacity: visible ? 1 : 0,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        className="relative w-full h-full"
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s ease-out' }}
      >
        <div
          className="relative w-full h-full transition-[mask-size] duration-200 ease-out"
          style={{
          maskImage: isMoving
            ? 'none'
            : 'linear-gradient(to top, transparent 0%, black 45%)',
          WebkitMaskImage: isMoving
            ? 'none'
            : 'linear-gradient(to top, transparent 0%, black 45%)',
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
        }}
        >
        <Image
          src="/images/cursor-spaceship.png"
          alt=""
          width={CURSOR_SIZE}
          height={CURSOR_SIZE}
          className="object-contain"
          priority
        />
        </div>
      </div>
    </div>
  )
}
