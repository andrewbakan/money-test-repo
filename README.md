# Budget Tracker

Мобільний веб-застосунок для обліку особистих витрат. Інтерфейс натхненний Apple Human Interface Guidelines: згруповані списки, нижня навігація, темна та світла тема.

**Live demo:** [andrewbakan.github.io/money-test-repo](https://andrewbakan.github.io/money-test-repo/)

## Можливості

- **Додавання витрат** — назва, сума, категорія; список витрат за сьогодні
- **Аналітика** — підсумок за місяць, діаграма по категоріях, порівняння з попереднім місяцем
- **Пошук** — у блоці «По категоріях» на вкладці «Огляд» (за поточний місяць)
- **Профіль** — реєстрація, зміна пароля, мова (UA/EN), тема
- **Категорії** — системні + власні, з кольорами та переназначенням витрат

Дані зберігаються локально в браузері (`localStorage`). Бекенду поки немає.

## Стек

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- Чистий CSS з дизайн-токенами (`src/styles/hig-tokens.css`)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) для лінтингу

## Швидкий старт

```bash
git clone https://github.com/andrewbakan/money-test-repo.git
cd money-test-repo
npm install
npm run dev
```

Відкрий [http://localhost:5173](http://localhost:5173).

**Потрібно:** Node.js 22+ (див. `.nvmrc`).

## Для розробників

- Гілка `main` — актуальний код; `gh-pages` — production-збірка для GitHub Pages
- Перед PR: `npm run lint` та `npm run build`
- CI автоматично перевіряє lint і build на кожному PR у `main`

## Скрипти

| Команда | Опис |
|---------|------|
| `npm run dev` | Dev-сервер з HMR |
| `npm run build` | Production-збірка в `dist/` |
| `npm run preview` | Перегляд production-збірки |
| `npm run lint` | Перевірка коду (Oxlint) |

## Структура проєкту

```
src/
├── main.jsx              # Точка входу, провайдери
├── App.jsx               # Навігація між вкладками
├── components/           # UI-компоненти
├── contexts/             # Auth, Theme, Categories
├── hooks/                # useExpenses
├── services/             # Локальна авторизація
├── utils/                # analytics, date, search, password
├── i18n/                 # Переклади UA/EN
└── constants/            # Системні категорії
```

## Деплой на GitHub Pages

1. У `vite.config.js` вказано `base: '/money-test-repo/'` — змініть, якщо репозиторій інший.
2. Збірка та публікація:

```bash
npm run build
npx gh-pages -d dist
```

3. У налаштуваннях репозиторію: **Settings → Pages → Branch:** `gh-pages`, папка `/ (root)`.

Після push у `main` сайт оновлюється автоматично через GitHub Actions (lint → build → deploy).

## Ліцензія

Приватний проєкт. Використовуй на свій розсуд.
