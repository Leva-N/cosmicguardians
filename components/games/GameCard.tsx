'use client'

import { useState } from 'react'
import { GameFrame } from './GameFrame'
import { GameCanvas } from './GameCanvas'
import { Leaderboard } from './Leaderboard'
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

type Props = { gameId: string }

export function GameCard({ gameId }: Props) {
  const [lbTab, setLbTab] = useState<'current' | 'weekly' | 'my'>('current')
  const g = GAMES[gameId]
  if (!g) return null
  return (
    <GameFrame gameId={gameId} gameName={g.name}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <GameCanvas gameId={gameId} gameName={g.name} width={400} height={600} runGame={g.run} />
        </div>
        <div className="w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-white/10 p-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setLbTab('current')}
              className={`px-2 py-1 text-xs rounded ${lbTab === 'current' ? 'bg-evedex-primary/20 text-evedex-primary' : 'text-[var(--text-secondary)]'}`}
            >
              Текущий
            </button>
            <button
              onClick={() => setLbTab('weekly')}
              className={`px-2 py-1 text-xs rounded ${lbTab === 'weekly' ? 'bg-evedex-primary/20 text-evedex-primary' : 'text-[var(--text-secondary)]'}`}
            >
              Неделя
            </button>
            <button
              onClick={() => setLbTab('my')}
              className={`px-2 py-1 text-xs rounded ${lbTab === 'my' ? 'bg-evedex-primary/20 text-evedex-primary' : 'text-[var(--text-secondary)]'}`}
            >
              Мой
            </button>
          </div>
          <Leaderboard gameId={gameId} tab={lbTab} />
        </div>
      </div>
    </GameFrame>
  )
}
