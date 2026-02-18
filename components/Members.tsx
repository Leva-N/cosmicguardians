'use client'

import { useLocale } from '@/components/LocaleProvider'

const members = [
  { name: 'Volunteer_01', role: 'Core Dev', telegram: 'https://t.me/volunteer01', discord: 'https://discord.com', twitter: 'https://twitter.com/volunteer01', avatar: 'V' },
  { name: 'Doc_Master', role: 'Documentation', telegram: 'https://t.me/docmaster', discord: 'https://discord.com', twitter: 'https://twitter.com/docmaster', avatar: 'D' },
  { name: 'Support_Pro', role: 'Community Support', telegram: 'https://t.me/supportpro', discord: 'https://discord.com', twitter: 'https://twitter.com/supportpro', avatar: 'S' },
  { name: 'Design_Eve', role: 'UI/UX', telegram: 'https://t.me/designeve', discord: 'https://discord.com', twitter: 'https://twitter.com/designeve', avatar: 'E' },
  { name: 'Gas_Optimizer', role: 'Smart Contracts', telegram: 'https://t.me/gasoptimizer', discord: 'https://discord.com', twitter: 'https://twitter.com/gasoptimizer', avatar: 'G' },
  { name: 'API_Wizard', role: 'Backend', telegram: 'https://t.me/apiwizard', discord: 'https://discord.com', twitter: 'https://twitter.com/apiwizard', avatar: 'A' },
  { name: 'Crypto_Knight', role: 'Security', telegram: 'https://t.me/cryptoknight', discord: 'https://discord.com', twitter: 'https://twitter.com/cryptoknight', avatar: 'C' },
  { name: 'DevOps_Eve', role: 'DevOps', telegram: 'https://t.me/devopseve', discord: 'https://discord.com', twitter: 'https://twitter.com/devopseve', avatar: 'O' },
  { name: 'Mod_Alpha', role: 'Moderation', telegram: 'https://t.me/modalpha', discord: 'https://discord.com', twitter: 'https://twitter.com/modalpha', avatar: 'M' },
  { name: 'Translate_Pro', role: 'Translation', telegram: 'https://t.me/translatepro', discord: 'https://discord.com', twitter: 'https://twitter.com/translatepro', avatar: 'T' },
  { name: 'Marketing_Guru', role: 'Marketing', telegram: 'https://t.me/marketingguru', discord: 'https://discord.com', twitter: 'https://twitter.com/marketingguru', avatar: 'K' },
  { name: 'QA_Guardian', role: 'QA', telegram: 'https://t.me/qaguardian', discord: 'https://discord.com', twitter: 'https://twitter.com/qaguardian', avatar: 'Q' },
  { name: 'Frontend_Star', role: 'Frontend', telegram: 'https://t.me/frontendstar', discord: 'https://discord.com', twitter: 'https://twitter.com/frontendstar', avatar: 'F' },
  { name: 'Blockchain_Bob', role: 'Smart Contracts', telegram: 'https://t.me/blockchainbob', discord: 'https://discord.com', twitter: 'https://twitter.com/blockchainbob', avatar: 'B' },
  { name: 'Data_Drifter', role: 'Analytics', telegram: 'https://t.me/datadrifter', discord: 'https://discord.com', twitter: 'https://twitter.com/datadrifter', avatar: 'R' },
  { name: 'UX_Cosmos', role: 'UI/UX', telegram: 'https://t.me/uxcosmos', discord: 'https://discord.com', twitter: 'https://twitter.com/uxcosmos', avatar: 'U' },
  { name: 'Token_Master', role: 'Tokenomics', telegram: 'https://t.me/tokenmaster', discord: 'https://discord.com', twitter: 'https://twitter.com/tokenmaster', avatar: 'N' },
  { name: 'Audit_Pro', role: 'Security Audit', telegram: 'https://t.me/auditpro', discord: 'https://discord.com', twitter: 'https://twitter.com/auditpro', avatar: 'P' },
  { name: 'Liquidity_Hero', role: 'Liquidity', telegram: 'https://t.me/liquidityhero', discord: 'https://discord.com', twitter: 'https://twitter.com/liquidityhero', avatar: 'L' },
  { name: 'Events_Coord', role: 'Events', telegram: 'https://t.me/eventscoord', discord: 'https://discord.com', twitter: 'https://twitter.com/eventscoord', avatar: 'H' },
  { name: 'Content_King', role: 'Content', telegram: 'https://t.me/contentking', discord: 'https://discord.com', twitter: 'https://twitter.com/contentking', avatar: 'I' },
  { name: 'Bridge_Builder', role: 'Integration', telegram: 'https://t.me/bridgebuilder', discord: 'https://discord.com', twitter: 'https://twitter.com/bridgebuilder', avatar: 'W' },
  { name: 'Testnet_Tester', role: 'Testing', telegram: 'https://t.me/testnettester', discord: 'https://discord.com', twitter: 'https://twitter.com/testnettester', avatar: 'Y' },
  { name: 'Graphic_Cosmic', role: 'Design', telegram: 'https://t.me/graphiccosmic', discord: 'https://discord.com', twitter: 'https://twitter.com/graphiccosmic', avatar: 'X' },
  { name: 'Node_Operator', role: 'Infrastructure', telegram: 'https://t.me/nodeoperator', discord: 'https://discord.com', twitter: 'https://twitter.com/nodeoperator', avatar: 'J' },
  { name: 'Community_Star', role: 'Community', telegram: 'https://t.me/communitystar', discord: 'https://discord.com', twitter: 'https://twitter.com/communitystar', avatar: 'Z' },
  { name: 'DeFi_Enthusiast', role: 'DeFi', telegram: 'https://t.me/defienthusiast', discord: 'https://discord.com', twitter: 'https://twitter.com/defienthusiast', avatar: '1' },
  { name: 'Validator_Eve', role: 'Validation', telegram: 'https://t.me/validatoreve', discord: 'https://discord.com', twitter: 'https://twitter.com/validatoreve', avatar: '2' },
  { name: 'Research_Lab', role: 'Research', telegram: 'https://t.me/researchlab', discord: 'https://discord.com', twitter: 'https://twitter.com/researchlab', avatar: '3' },
  { name: 'Ambassador_CG', role: 'Ambassador', telegram: 'https://t.me/ambassadorcg', discord: 'https://discord.com', twitter: 'https://twitter.com/ambassadorcg', avatar: '4' },
]

export function Members() {
  const { t } = useLocale()
  return (
    <section id="members" className="relative py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 text-center animate-in">
          <h2 className="mb-4 text-2xl sm:text-3xl font-bold md:text-4xl">
            <span className="gradient-text">{t('members.title')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            {t('members.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <div
              key={member.name}
              className="glass-card group rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col items-center text-center animate-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-evedex-primary to-evedex-accent flex items-center justify-center text-2xl font-bold text-white shadow-neon group-hover:scale-105 transition-transform">
                {member.avatar}
              </div>
              <h3 className="mb-4 font-semibold">{member.name}</h3>
              <div className="mt-auto flex flex-wrap gap-2 justify-center">
                <a
                  href={member.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={member.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors"
                >
                  Discord
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors"
                >
                  X
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
