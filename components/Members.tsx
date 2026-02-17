'use client'

import { motion } from 'framer-motion'

const members = [
  { name: 'Volunteer_01', role: 'Core Dev', contributions: 156, avatar: 'V' },
  { name: 'Doc_Master', role: 'Documentation', contributions: 89, avatar: 'D' },
  { name: 'Support_Pro', role: 'Community Support', contributions: 234, avatar: 'S' },
  { name: 'Design_Eve', role: 'UI/UX', contributions: 45, avatar: 'E' },
  { name: 'Gas_Optimizer', role: 'Smart Contracts', contributions: 67, avatar: 'G' },
  { name: 'API_Wizard', role: 'Backend', contributions: 112, avatar: 'A' },
]

export function Members() {
  return (
    <section id="members" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">Участники и вклад</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            Люди, которые делают EVEDEX живой и развивающейся платформой
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group rounded-2xl p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-evedex-primary to-evedex-accent flex items-center justify-center text-2xl font-bold text-white shadow-neon group-hover:scale-105 transition-transform">
                {member.avatar}
              </div>
              <h3 className="mb-1 font-semibold">{member.name}</h3>
              <p className="mb-4 text-sm text-evedex-primary">{member.role}</p>
              <div className="mt-auto rounded-lg bg-white/5 px-4 py-2">
                <span className="text-2xl font-bold text-evedex-achievement">{member.contributions}</span>
                <span className="ml-2 text-sm text-[var(--text-secondary)]">вкладов</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
