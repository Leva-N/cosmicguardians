'use client'

import dynamic from 'next/dynamic'

const GalaxyBackgroundWrapper = dynamic(
  () => import('@/components/GalaxyBackground').then((m) => m.GalaxyBackgroundWrapper),
  { ssr: false }
)

export function GalaxyBackgroundClient() {
  return <GalaxyBackgroundWrapper />
}
