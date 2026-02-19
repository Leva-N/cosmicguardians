/**
 * Проверка прав на публикацию новостей и статей.
 * Публиковать могут только волонтёры (MEMBER_DISCORD_IDS) и команда проекта (GOLD_MEMBER_DISCORD_IDS).
 */
import { GOLD_MEMBER_DISCORD_IDS, MEMBER_DISCORD_IDS } from '@/components/Members'

export function canPublishContent(userId: string): boolean {
  return GOLD_MEMBER_DISCORD_IDS.has(userId) || MEMBER_DISCORD_IDS.has(userId)
}
