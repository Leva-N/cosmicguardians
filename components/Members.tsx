'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ADMIN_DISCORD_IDS } from '@/lib/admin-ids'
import { useLocale } from '@/components/LocaleProvider'

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

type Member = {
  name: string
  role?: string
  avatar: string
  telegram?: string
  discord?: string
  twitter?: string
  invite?: string
}

const members: Member[] = [
  { name: 'HALK', role: 'Community', telegram: 'https://t.me/RichardKizlo', discord: 'https://discordapp.com/users/537269062829473792', twitter: 'https://x.com/H8LKK', invite: 'https://invite.evedex.com/halk', avatar: '/images/photo_2026-02-19_15-04-01.jpg' },
  { name: '!!!', telegram: 'https://t.me/dikiyCryptoboss', discord: 'https://discordapp.com/users/1236693476075245589', invite: 'https://invite.evedex.com/?code=cryptobro', avatar: '/images/photo_2025-02-17_20-11-44.jpg' },
  { name: 'AVE', telegram: 'https://t.me/avecosmic', discord: 'https://discordapp.com/users/761468626929844265', twitter: 'https://x.com/avecosmic', invite: 'https://invite.evedex.com/?code=avecosmic', avatar: '/images/photo_2026-01-14_13-40-27.jpg' },
  { name: 'Andrew', telegram: 'https://t.me/YakushAndrey', discord: 'https://discordapp.com/users/1034431547828351007', invite: 'https://invite.evedex.com/homepage', avatar: '/images/photo_2026-02-19_15-47-12.jpg' },
  { name: 'Augusto', telegram: 'https://t.me/Augustomarquesthai', discord: 'https://discordapp.com/users/1230807644458061875', twitter: 'https://x.com/AugustoGut40997', invite: 'https://invite.evedex.com/95mxpt6n', avatar: 'A' },
  { name: 'CRYPTOMORHA', discord: 'https://discordapp.com/users/1271382602594521131', invite: 'https://invite.evedex.com/re4lJvOx', avatar: 'C' },
  { name: 'CheddarShredder', telegram: 'https://t.me/Adam_418', discord: 'https://discordapp.com/users/246291717244977152', avatar: '/images/photo_2024-11-30_19-09-17.jpg' },
  { name: 'Den', telegram: 'https://t.me/didext', discord: 'https://discordapp.com/users/1281312694149845027', invite: 'https://invite.evedex.com/kgoq4627', avatar: '/images/photo_2026-02-19_18-20-43.jpg' },
  { name: 'Dr.Plague', telegram: 'https://t.me/vovankhibeba', discord: 'https://discordapp.com/users/1129685897642774558', twitter: 'https://x.com/vovankhibeba', invite: 'https://invite.evedex.com/plaguedoctor', avatar: '/images/f60E3fw5_400x400.jpg' },
  { name: 'EG', telegram: 'https://t.me/ElsNGl', discord: 'https://discordapp.com/users/982590697221799956', invite: 'https://invite.evedex.com/ofBdOrBP', avatar: '/images/photo_2022-04-13_15-01-23.jpg' },
  { name: 'G_M', telegram: 'https://t.me/FlyBleg', discord: 'https://discordapp.com/users/220559498295640064', invite: 'https://invite.evedex.com/zastavil', avatar: '/images/photo_2025-10-07_00-20-01.jpg' },
  { name: 'ILCKUSHIN', telegram: 'https://t.me/ILckushin', discord: 'https://discordapp.com/users/565800942189150208', twitter: 'https://x.com/ilckushin', invite: 'https://invite.evedex.com/4Mf3B6TM', avatar: '/images/photo_2024-12-18_21-10-35.jpg' },
  { name: 'INSANE', telegram: 'https://t.me/INSANEWOT', discord: 'https://discordapp.com/users/755138605185499197', twitter: 'https://x.com/alexlyopa', invite: 'https://invite.evedex.com/insanewot', avatar: '/images/photo_2026-01-05_19-42-49.jpg' },
  { name: 'Interstorm', telegram: 'https://t.me/Interstorm1', discord: 'https://discordapp.com/users/1341039135732928512', invite: 'https://invite.evedex.com/interstorm', avatar: '/images/photo_2025-10-14_19-15-51.jpg' },
  { name: 'Kalan', telegram: 'https://t.me/kalan9', discord: 'https://discordapp.com/users/1235882144589680692', invite: 'https://invite.evedex.com/ehi09OdA', avatar: '/images/photo_2024-07-22_16-55-00.jpg' },
  { name: 'Khal', telegram: 'https://t.me/khal_dao', discord: 'https://discordapp.com/users/966074293081489458', twitter: 'https://x.com/khal_bnb', invite: 'https://invite.evedex.com/Lw18ynYq', avatar: '/images/photo_2025-08-22_19-31-58.jpg' },
  { name: 'Konstantin_BassS', telegram: 'https://t.me/Crypto_Mayachok2', discord: 'https://discordapp.com/users/731979567774040065', twitter: 'https://x.com/KonstantinBassS', invite: 'https://invite.evedex.com/konstantin', avatar: '/images/photo_2026-01-09_20-25-49.jpg' },
  { name: 'Lamgonus', telegram: 'https://t.me/lamgonus', discord: 'https://discordapp.com/users/1033830705140076604', invite: 'https://invite.evedex.com/?code=obmw52ee#/en-US/', avatar: '/images/photo_2024-05-29_19-00-03.jpg' },
  { name: 'Nedu', telegram: 'https://t.me/DanielezeC', discord: 'https://discordapp.com/users/827288164204412978', invite: 'https://invite.evedex.com/Nob3m2rU', avatar: '/images/photo_2020-12-26_14-17-18.jpg' },
  { name: 'OnePiece', telegram: 'https://t.me/Duxnguyeexn', discord: 'https://discordapp.com/users/1019926090283745332', twitter: 'https://x.com/DuNguyen88', invite: 'https://invite.evedex.com/SIKj6Xio', avatar: '/images/VIUCYsd3_400x400.jpg' },
  { name: 'Rayd', telegram: 'https://t.me/Pre_millionaire', discord: 'https://discordapp.com/users/1125959895984918599', invite: 'https://invite.evedex.com/c2hxquv0', avatar: '/images/photo_2025-08-28_08-14-29.jpg' },
  { name: 'SenGaxD', telegram: 'https://t.me/SenGaxD', discord: 'https://discordapp.com/users/251059767429169152', invite: 'https://invite.evedex.com/sengaxd', avatar: '/images/photo_2026-02-13_22-23-57.jpg' },
  { name: 'Umraish', telegram: 'https://t.me/Umraish', discord: 'https://discordapp.com/users/680051014271107111', twitter: 'https://x.com/umarkkr15', invite: 'https://invite.evedex.com/umraish', avatar: '/images/photo_2022-02-27_07-28-29.jpg' },
  { name: 'andhrew', telegram: 'https://t.me/andhrew', discord: 'https://discordapp.com/users/546428380430729216', invite: 'https://invite.evedex.com/andhrew', avatar: '/images/photo_2025-11-28_19-18-42.jpg' },
  { name: 'iskandaroff94', telegram: 'https://t.me/iskandaroff94', discord: 'https://discordapp.com/users/1233372037771300944', twitter: 'https://x.com/iskandaroff94', avatar: '/images/photo_2024-02-22_18-28-58.jpg' },
  { name: 'lovers lovers', telegram: 'https://t.me/Xorpc123', discord: 'https://discordapp.com/users/1274177677615566909', twitter: 'https://x.com/Osamahassen4', invite: 'https://invite.evedex.com/ro8rxtmu', avatar: '/images/photo_2025-09-17_01-16-19.jpg' },
  { name: 'm0ri', telegram: 'https://t.me/workerInstinct', discord: 'https://discordapp.com/users/1460230937509105767', twitter: 'https://x.com/m0ri_web3', avatar: '/images/photo_2026-02-19_16-13-28.jpg' },
]

export const MEMBER_DISCORD_IDS = new Set([
  ...members
    .filter((m) => m.discord)
    .map((m) => m.discord!.match(/users\/(\d+)/)?.[1])
    .filter((id): id is string => Boolean(id)),
])

export { ADMIN_DISCORD_IDS }

export const GOLD_MEMBER_DISCORD_IDS = new Set([
  '785741234202738688',
  '1147174887954333808',
  '392022688798867476',
  '295152023475585024',
  '693122494575411200',
])

export function Members() {
  const { t } = useLocale()
  const [displayMembers, setDisplayMembers] = useState<Member[]>(members)

  useEffect(() => {
    setDisplayMembers(shuffleArray(members))
  }, [])

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
          {displayMembers.map((member, i) => (
            <div
              key={member.name}
              className="glass-card glass-card-purple group rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col items-center text-center animate-in backdrop-blur-xl"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="mb-4 h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-evedex-primary to-evedex-accent flex items-center justify-center text-2xl font-bold text-white shadow-neon group-hover:scale-105 transition-transform shrink-0">
                {typeof member.avatar === 'string' && member.avatar.startsWith('/') ? (
                  <Image src={member.avatar} alt={member.name} width={64} height={64} className="h-full w-full object-cover" />
                ) : (
                  member.avatar
                )}
              </div>
              <h3
                className={`mb-4 font-semibold ${member.discord && GOLD_MEMBER_DISCORD_IDS.has(member.discord.match(/users\/(\d+)/)?.[1] ?? '') ? 'text-[#FFD700]' : 'text-[#00ff00]'}`}
              >
                {member.name}
              </h3>
              <div className="mt-auto flex flex-wrap gap-2 justify-center">
                {member.telegram && (
                  <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors">
                    Telegram
                  </a>
                )}
                {member.discord && (
                  <a href={member.discord.startsWith('http') ? member.discord : `https://${member.discord}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors">
                    Discord
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors">
                    X
                  </a>
                )}
                {member.invite && (
                  <a href={member.invite.startsWith('http') ? member.invite : `https://${member.invite}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 px-3 py-2.5 min-h-[40px] flex items-center text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors">
                    EVEDEX
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
