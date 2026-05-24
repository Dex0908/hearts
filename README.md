# SkyHearts 🕯️

Сервис доставки сердечек для игры **Sky: Children of the Light**.

## Что это такое?

SkyHearts — это небольшой бизнес-проект: люди платят деньги, а ты вручную дариешь им сердца в игре Sky. Проект состоит из трёх частей:

- **Web** (`apps/web`) — сайт для клиентов: лендинг, регистрация, оформление заказа, личный кабинет с прогрессом
- **Admin** (`apps/admin`) — закрытая панель для тебя: список всех заказов, обновление прогресса, статистика
- **Bot** (`apps/bot`) — Telegram-бот: клиенты получают уведомления о доставке прямо в Telegram

---

## Стек технологий

| Технология | Для чего |
|---|---|
| Next.js 15 | Веб-фреймворк (web + admin) |
| TypeScript | Язык программирования |
| Prisma + PostgreSQL | База данных |
| Telegraf | Telegram-бот |
| Tailwind CSS | Стили |
| jose | JWT-токены (авторизация) |
| bcryptjs | Хэширование паролей |

---

## Быстрый старт

### 1. Требования

- Node.js 18+
- npm 9+
- PostgreSQL (рекомендуется [Neon](https://neon.tech) — бесплатный облачный PostgreSQL)

### 2. Установка

```bash
# Клонируй/распакуй проект
cd skyhearts

# Установи все зависимости
npm install
```

### 3. Настройка окружения

```bash
# Скопируй пример конфига
cp .env.example .env
```

Открой `.env` и заполни:

```env
# Строка подключения к PostgreSQL (из Neon или своей БД)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Секретные ключи (придумай любые длинные строки, минимум 32 символа)
JWT_SECRET="придумай-длинный-секрет-для-пользователей"
ADMIN_JWT_SECRET="придумай-длинный-секрет-для-админа"

# Telegram (получи токен у @BotFather)
TELEGRAM_BOT_TOKEN="..."
ADMIN_TELEGRAM_ID="..."  # твой ID в Telegram (узнай у @userinfobot)
```

### 4. База данных

```bash
# Создать таблицы
npm run db:push

# Заполнить тестовыми данными (создаст admin/hearts2025 и demo-пользователя)
npm run db:seed
```

### 5. Запуск

```bash
# Запустить всё сразу
npm run dev

# Или по отдельности:
npm run dev:web    # сайт → http://localhost:3000
npm run dev:admin  # админка → http://localhost:3001
npm run dev:bot    # Telegram-бот
```

---

## Доступы по умолчанию (после seed)

| Роль | Логин | Пароль |
|---|---|---|
| Администратор | `admin` | `hearts2025` |
| Демо-пользователь | `demo@skyhearts.app` | `demo1234` |

> ⚠️ Обязательно смени пароли перед деплоем!

---

## Структура проекта

```
skyhearts/
├── apps/
│   ├── web/        # Сайт для клиентов (порт 3000)
│   ├── admin/      # Панель администратора (порт 3001)
│   └── bot/        # Telegram-бот
└── packages/
    ├── shared/     # Общие типы, цены, утилиты
    └── db/         # Prisma клиент и схема БД
```

---

## Команды

```bash
npm run dev              # Запустить всё
npm run build:web        # Собрать web для продакшна
npm run build:admin      # Собрать admin для продакшна
npm run db:studio        # Открыть визуальный редактор БД
npm run db:migrate       # Применить миграции БД
```

---

## Деплой

Рекомендуемый вариант:
- **Web + Admin** → [Vercel](https://vercel.com) (бесплатно для небольших проектов)
- **Bot** → [Railway](https://railway.app) или VPS
- **БД** → [Neon](https://neon.tech) (бесплатный тариф)
