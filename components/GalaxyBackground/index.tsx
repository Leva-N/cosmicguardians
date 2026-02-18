'use client'

import React from 'react'
import { GalaxyScene } from './GalaxyScene'

export function GalaxyBackgroundWrapper() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#0d0a14',
      }}
    >
      <GalaxyScene />
    </div>
  )
}
