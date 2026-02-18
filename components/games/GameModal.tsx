'use client'

import { useEffect } from 'react'
import { GameFrame } from './GameFrame'
import { GameCanvas } from './GameCanvas'
import { TournamentTable } from './TournamentTable'
import { CountdownToReset } from './CountdownToReset'
import { ShareResult } from './ShareResult'
import { createSpaceShooter } from './logic/spaceShooter'
import { createAlienInvaders } from './logic/alienInvaders'
import { createMeteorDodge } from './logic/meteorDodge'
import { createGalaxyRunner } from './logic/galaxyRunner'
import { createPlanetDefense } from './logic/planetDefense'
import { createUfoCatcher } from './logic/ufoCatcher'
import { createRocketLanding } from './logic/rocketLanding'
import { createStarCollector } from './logic/starCollector'
import { createWarpTunnel } from './logic/warpTunnel'
import { createSpaceMining } from './logic/spaceMining'

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

type Props = { gameId: string; onClose: () => void }

export function GameModal({ gameId, onClose }: Props) {
  const g = GAMES[gameId]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!g) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-[var(--bg-secondary)] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-lg font-semibold">{g.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-white/10 hover:text-white"
            aria-label="Закрыть"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <GameFrame gameId={gameId} gameName={g.name}>
            <div className="flex justify-center bg-[#0a0a12] p-4">
              <GameCanvas gameId={gameId} gameName={g.name} width={400} height={560} runGame={g.run} />
            </div>
          </GameFrame>

          <div className="border-t border-white/10 p-6">
            <h3 className="mb-3 text-base font-semibold">Турнирная таблица (текущая неделя)</h3>
            <div className="mb-4">
              <TournamentTable gameId={gameId} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <CountdownToReset />
              <ShareResult gameName={g.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
