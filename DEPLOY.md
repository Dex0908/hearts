# 🚀 SkyHearts — Деплой на Vercel / Deploy to Vercel

---

## 📁 Структура файлов / File Structure

```
skyhearts/
├── index.html        ← Главная страница / Landing page
├── pricing.html      ← Цены / Pricing
├── order.html        ← Форма заказа / Order form
├── dashboard.html    ← Кабинет клиента / Client dashboard
├── admin.html        ← Панель администратора / Admin panel
├── style.css         ← Общие стили / Shared styles
├── main.js           ← Логика + переводы / Logic + i18n
└── vercel.json       ← Конфиг Vercel / Vercel config
```

---

## 🇷🇺 Способ 1: Через сайт Vercel (без командной строки)

### Шаг 1 — Создать аккаунт
1. Зайди на **vercel.com**
2. Нажми **Sign Up** → выбери **Continue with GitHub**
3. Создай аккаунт на GitHub, если ещё нет

### Шаг 2 — Загрузить файлы на GitHub
1. Зайди на **github.com** → нажми **New repository**
2. Назови репозиторий `skyhearts`, сделай его **Public**
3. Нажми **uploading an existing file**
4. Перетащи ВСЕ файлы из папки `skyhearts/` (все 7 файлов)
5. Нажми **Commit changes**

### Шаг 3 — Деплой на Vercel
1. Зайди на **vercel.com/new**
2. Нажми **Import Git Repository**
3. Выбери репозиторий `skyhearts`
4. Настройки оставь по умолчанию (Framework: Other, Root: /)
5. Нажми **Deploy**
6. Через ~30 секунд сайт будет доступен по адресу `skyhearts.vercel.app`

---

## 🇬🇧 Method 2: Via Vercel CLI (command line)

### Prerequisites
- Node.js installed (nodejs.org)
- All 7 files in a folder called `skyhearts/`

### Step 1 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2 — Login
```bash
vercel login
# Opens browser → sign in with GitHub / Google / email
```

### Step 3 — Deploy
```bash
cd skyhearts
vercel
```
Follow the prompts:
- Set up and deploy? → **Y**
- Which scope? → select your account
- Link to existing project? → **N**
- Project name → `skyhearts` (or press Enter)
- In which directory is your code? → `.` (press Enter)
- Want to override settings? → **N**

### Step 4 — Production deploy
```bash
vercel --prod
```
Your site is now live at `https://skyhearts.vercel.app` 🎉

---

## 🌐 Свой домен / Custom Domain

1. Купи домен (например, на **namecheap.com** или **reg.ru**)
2. В Vercel → Settings → Domains → Add Domain
3. Укажи домен, например `skyhearts.ru`
4. Vercel даст тебе DNS-записи — добавь их в настройках домена
5. Через 5–30 минут сайт будет работать на своём домене

---

## 🔄 Обновление сайта / Updating the site

### Через GitHub (автоматически):
Просто пуш в GitHub — Vercel автоматически задеплоит обновление.
```bash
git add .
git commit -m "update"
git push
```

### Через CLI:
```bash
vercel --prod
```

---

## ✅ Чеклист перед деплоем / Pre-deploy checklist

- [ ] Все 7 файлов в одной папке
- [ ] `vercel.json` находится в корне папки
- [ ] Проверил сайт локально (открой `index.html` в браузере)
- [ ] Язык переключается (EN/RU кнопки в шапке)
- [ ] Ссылки между страницами работают
- [ ] Форма заказа ведёт на правильную страницу

---

## 🔒 Защита Admin Panel

Сейчас `/admin.html` доступна всем! Чтобы защитить:

**Вариант 1 (простой)** — переименуй файл в `admin-secret-abc123.html` и не давай ссылку никому.

**Вариант 2 (через Vercel)** — добавь в `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/admin",
      "headers": { "x-vercel-protection": "..." }
    }
  ]
}
```
И включи **Password Protection** в настройках проекта (требует платный план).

---

## 💡 Следующие шаги / Next Steps

- Подключи **Telegram Bot API** для реальных уведомлений
- Добавь **Stripe** или **Telegram Payments** для оплаты
- Используй **Vercel KV** или **Supabase** для хранения заказов в базе данных
- Настрой **Google Analytics** для аналитики

---

*Сделано с ❤️ SkyHearts · Hosted on Vercel*
