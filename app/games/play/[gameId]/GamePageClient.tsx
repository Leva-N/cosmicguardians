'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/components/LocaleProvider'
import { GameFrame } from '@/components/games/GameFrame'
import { GameCanvas } from '@/components/games/GameCanvas'
import { TournamentTable } from '@/components/games/TournamentTable'
import { CountdownToReset } from '@/components/games/CountdownToReset'
import { ShareResult } from '@/components/games/ShareResult'
import { createSpaceShooter } from '@/components/games/logic/spaceShooter'
import { createAlienInvaders } from '@/components/games/logic/alienInvaders'
import { createMeteorDodge } from '@/components/games/logic/meteorDodge'
import { createGalaxyRunner } from '@/components/games/logic/galaxyRunner'
import { createPlanetDefense } from '@/components/games/logic/planetDefense'
import { createUfoCatcher } from '@/components/games/logic/ufoCatcher'
import { createRocketLanding } from '@/components/games/logic/rocketLanding'
import { createStarCollector } from '@/components/games/logic/starCollector'
import { createWarpTunnel } from '@/components/games/logic/warpTunnel'
import { createSpaceMining } from '@/components/games/logic/spaceMining'

const GAMES: Record<string, { name: string; run: typeof createSpaceShooter }> = {
  'space-shooter': { name: 'Space Shooter', run: createSpaceShooter },
  'alien-invaders': { name: 'Alien Invaders', run: createAlienInvaders },
  'meteor-dodge': { name: 'Meteor Dodge', run: createMeteorDodge },
  'galaxy-runner': { name: 'Galaxy Runner', run: createGalaxyRunner },
  'planet-defense': { name: 'Planet Defense', run: createPlanetDefense },
  'ufo-catcher': { name: 'UFO Catcher', run: createUfoCatcher },
  'rocket-landing': { name: 'Rocket Landing', run: createRocketLanding },
  'star-collector': { name: 'Star Collector', run: createStarCollector },
  'warp-tunnel': { name: 'Warp Tunnel', run: createWarpTunnel },
  'space-mining': { name: 'Space Mining', run: createSpaceMining },
}

type Props = { gameId: string; gameName: string }

const BASE_WIDTH = 400
const BASE_HEIGHT = 560

function useGameDimensions() {
  const [dim, setDim] = useState({ width: BASE_WIDTH, height: BASE_HEIGHT })
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024
      if (w < 440) {
        const width = Math.max(280, w - 32)
        setDim({ width, height: Math.round((width / BASE_WIDTH) * BASE_HEIGHT) })
      } else {
        setDim({ width: BASE_WIDTH, height: BASE_HEIGHT })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return dim
}

export function GamePageClient({ gameId, gameName }: Props) {
  const { t } = useLocale()
  const g = GAMES[gameId]
  const { width, height } = useGameDimensions()
  if (!g) return null

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-4 text-lg sm:text-xl font-semibold">{t('games.play')}</h2>
        <GameFrame gameId={gameId} gameName={g.name}>
          <div className="flex justify-center bg-[#0a0a12] p-2 sm:p-4">
            <GameCanvas gameId={gameId} gameName={g.name} width={width} height={height} runGame={g.run} />
          </div>
        </GameFrame>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">{t('games.rating')}</h2>
        <TournamentTable gameId={gameId} />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <CountdownToReset />
          <ShareResult gameName={gameName} />
        </div>
      </div>
    </>
  )
}
