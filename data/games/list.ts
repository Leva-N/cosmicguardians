export const GAMES_LIST = [
  { id: 'space-shooter', name: 'Space Shooter', desc: 'Корабль стреляет в астероиды', icon: '🚀', about: 'Управляйте кораблём, уничтожайте астероиды и набирайте очки. Стрелки — движение, Пробел — стрельба.' },
  { id: 'alien-invaders', name: 'Alien Invaders', desc: 'Пришельцы атакуют волнами', icon: '👽', about: 'Классический шутер: отбивайте волны пришельцев. Стрелки — движение, Пробел — выстрел.' },
  { id: 'meteor-dodge', name: 'Meteor Dodge', desc: 'Уворачивайтесь от метеоритов', icon: '☄️', about: 'Выживайте как можно дольше, уклоняясь от падающих метеоритов. Управление: стрелки влево/вправо.' },
  { id: 'galaxy-runner', name: 'Galaxy Runner', desc: 'Бесконечный космический раннер', icon: '🌌', about: 'Переключайте полосы движения и избегайте препятствий. Стрелки влево/вправо.' },
  { id: 'planet-defense', name: 'Planet Defense', desc: 'Защита планеты от объектов', icon: '🛡️', about: 'Вращайте пушку и стреляйте по астероидам, летящим к планете. Стрелки — поворот, Пробел — выстрел.' },
  { id: 'ufo-catcher', name: 'UFO Catcher', desc: 'Ловля инопланетян, избегание ловушек', icon: '🛸', about: 'Ловите пришельцев кораблём и не попадайте в красные ловушки. Стрелки — движение.' },
  { id: 'rocket-landing', name: 'Rocket Landing', desc: 'Посадка ракеты на платформу', icon: '🚀', about: 'Плавно посадите ракету на зелёную платформу. Стрелки — тяга, не разбивайтесь.' },
  { id: 'star-collector', name: 'Star Collector', desc: 'Сбор звёзд, избегание чёрных дыр', icon: '⭐', about: 'Собирайте звёзды и не попадайте в чёрные дыры. Управление: стрелки во все стороны.' },
  { id: 'warp-tunnel', name: 'Warp Tunnel', desc: 'Полёт по тоннелю с уклонением', icon: '🌀', about: 'Летите по тоннелю и уворачивайтесь от препятствий. Стрелки влево/вправо.' },
  { id: 'space-mining', name: 'Space Mining', desc: 'Добыча ресурсов с астероидов', icon: '⛏️', about: 'Собирайте астероиды для очков и пополняйте топливо. Стрелки — движение.' },
] as const

export const GAME_IDS = GAMES_LIST.map((g) => g.id)
export type GameId = (typeof GAMES_LIST)[number]['id']

export function getGameById(id: string) {
  return GAMES_LIST.find((g) => g.id === id)
}
