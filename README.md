# EVEDEX Community — Фан-сайт волонтёров

Минималистичный Web3-интерфейс волонтёрского сообщества биржи EVEDEX. Чистый, быстрый и интуитивный UI на Next.js.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Discord авторизация

Чтобы включить вход через Discord:

1. Создайте приложение на [Discord Developer Portal](https://discord.com/developers/applications)
2. Скопируйте `.env.local.example` в `.env.local`
3. Укажите `DISCORD_CLIENT_ID` и `DISCORD_CLIENT_SECRET`
4. В настройках приложения → OAuth2 → Redirects добавьте:  
   `http://localhost:3000/api/auth/discord/callback`

## Стек

- **Next.js 14** — React-фреймворк
- **Tailwind CSS** — стилизация
- **Framer Motion** — анимации
- **TypeScript** — типизация

## Структура

- `app/` — страницы и layout (App Router)
- `components/` — переиспользуемые компоненты
- Тёмная и светлая тема
- Web3-градиенты и неоновые акценты
- Адаптивная вёрстка

## Секции

1. **Hero** — главный слоган и описание миссии
2. **Mission** — ценности волонтёров (прозрачность, доверие, вклад)
3. **Activity** — интерактивная лента активности сообщества
4. **Members** — карточки участников и их вклад
5. **Stats** — панель статистики биржи
6. **News** — новости и обновления
7. **Footer** — ссылки на документацию и соцсети
