/** Discord ID администраторов: могут удалять любой контент в новости, ретранслятор, вселенная */
export const ADMIN_DISCORD_IDS = new Set(['406118319612231682'])

export function isAdmin(userId: string): boolean {
  return ADMIN_DISCORD_IDS.has(userId)
}
