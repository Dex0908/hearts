// ===== SKYHEARTS SHARED JS =====

// ---- STARS ----
function initStars(containerId = 'stars') {
  const el = document.getElementById(containerId);
  if (!el) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*4}s;opacity:${0.1+Math.random()*0.6}`;
    el.appendChild(s);
  }
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${20+Math.random()*60}%;--fd:${6+Math.random()*6}s;--fdelay:${Math.random()*5}s`;
    el.appendChild(p);
  }
}

// ---- MOBILE NAV ----
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

// ---- LANGUAGE SWITCHER ----
const TRANSLATIONS = {
  en: {
    nav_home: 'Home',
    nav_pricing: 'Pricing',
    nav_dashboard: 'Dashboard',
    nav_order: 'Order Now',
    // Landing
    hero_badge: '✨ Sky: Children of the Light',
    hero_h1: 'Collect Hearts,<br>Ascend Together',
    hero_p: 'The most trusted Heart gifting service for Sky. Safe, fast delivery — powered by real players, automated tracking, and Telegram updates.',
    hero_btn1: '🌟 Browse Packages',
    hero_btn2: 'My Orders',
    stat1_label: 'Hearts Delivered',
    stat2_label: 'Happy Players',
    stat3_label: 'Satisfaction',
    packages_title: 'Heart Packages',
    packages_sub: 'Choose your ascension path — all prices include tracking & Telegram updates',
    faq_title: 'Common Questions',
    faq_sub: 'Everything you need to know',
    faq1_q: 'How does heart delivery work?',
    faq1_a: 'We use real Sky player accounts to gift you hearts in-game. After payment confirmation, your order enters our queue and we start delivering within your ETA window. You\'ll get Telegram notifications at every step.',
    faq2_q: 'Is it safe for my account?',
    faq2_a: 'Yes — receiving hearts is a core game mechanic and completely safe. We never ask for your password. We only need your Sky friendship code to send you hearts.',
    faq3_q: 'How do I track my order?',
    faq3_a: 'After placing your order, you\'ll get access to a personal dashboard with live progress tracking, hearts delivered, ETA countdown, and a timeline of updates. You can also connect Telegram for push notifications.',
    faq4_q: 'What payment methods do you accept?',
    faq4_a: 'We accept all major payment methods including PayPal, credit/debit cards, and crypto. Payment is processed securely and confirmed automatically.',
    // Pricing
    pricing_title: 'Choose Your Package',
    pricing_sub: 'ETA calculated based on 50 hearts/day capacity + 2 safety buffer days',
    click_to_order: 'Click any package to order',
    per_heart: '/heart',
    // Order
    order_title: 'Place Your Order',
    order_sub: 'Fill in your details below to begin your ascension',
    selected_pkg: 'Selected Package',
    not_selected: '— Package not selected',
    select_eta: 'Select a package to see estimated delivery',
    label_nickname: 'Sky Nickname',
    ph_nickname: 'Your in-game name',
    label_code: 'Sky Friendship Code',
    ph_code: 'e.g. SKY-ABCD-1234',
    label_contact: 'Preferred Contact Method',
    label_username: 'Contact Username / Link',
    ph_username: '@username or profile link',
    label_email: 'Email (for order tracking)',
    btn_place: '🌟 Place Order & Proceed to Payment',
    order_note: 'Secure payment • Order tracked • Telegram updates',
    change: 'Change',
    // Dashboard
    dash_title: '✨ Your Dashboard',
    dash_sub: 'Welcome back, StarChild_77 • Order #SKH-4821',
    notif: '✅ Progress update: 40 hearts delivered today!',
    tg_title: 'Connect Telegram',
    tg_sub: 'Get instant delivery notifications via @SkyHeartsBot',
    tg_btn: 'Connect',
    label_ordered: 'Hearts Ordered',
    label_delivered: 'Delivered',
    label_remaining: 'Remaining',
    label_eta: 'ETA',
    eta_val: '3 days left',
    progress_label: 'Delivery Progress',
    // Footer
    footer_copy: '© 2025 SkyHearts. Not affiliated with thatgamecompany.',
    terms: 'Terms',
    privacy: 'Privacy',
    contact: 'Contact',
    faq: 'FAQ',
  },
  ru: {
    nav_home: 'Главная',
    nav_pricing: 'Цены',
    nav_dashboard: 'Кабинет',
    nav_order: 'Заказать',
    hero_badge: '✨ Sky: Дети Света',
    hero_h1: 'Собирай Сердца,<br>Восходи Вместе',
    hero_p: 'Самый надёжный сервис дарения сердец в Sky. Быстро, безопасно — реальные игроки, автоматическое отслеживание и уведомления в Telegram.',
    hero_btn1: '🌟 Смотреть Пакеты',
    hero_btn2: 'Мои Заказы',
    stat1_label: 'Сердец Доставлено',
    stat2_label: 'Довольных Игроков',
    stat3_label: 'Удовлетворённость',
    packages_title: 'Пакеты Сердец',
    packages_sub: 'Выберите свой путь — цены включают отслеживание и уведомления в Telegram',
    faq_title: 'Частые Вопросы',
    faq_sub: 'Всё, что нужно знать',
    faq1_q: 'Как работает доставка сердец?',
    faq1_a: 'Мы используем реальные аккаунты Sky для отправки сердец. После подтверждения оплаты ваш заказ встаёт в очередь, и мы начинаем доставку в указанные сроки. На каждом шаге вы получаете уведомление в Telegram.',
    faq2_q: 'Это безопасно для моего аккаунта?',
    faq2_a: 'Да — получение сердец является стандартной игровой механикой и абсолютно безопасно. Мы никогда не запрашиваем ваш пароль. Нам нужен только код дружбы Sky.',
    faq3_q: 'Как отслеживать заказ?',
    faq3_a: 'После оформления заказа у вас появляется доступ к личному кабинету с прогресс-баром, счётчиком доставленных сердец, таймером и историей обновлений. Можно подключить Telegram для push-уведомлений.',
    faq4_q: 'Какие методы оплаты принимаются?',
    faq4_a: 'Принимаем PayPal, банковские карты и криптовалюту. Оплата обрабатывается безопасно и подтверждается автоматически.',
    pricing_title: 'Выберите Пакет',
    pricing_sub: 'ETA рассчитывается из пропускной способности 50 сердец/день + 2 дня запаса',
    click_to_order: 'Нажмите на любой пакет для заказа',
    per_heart: '/сердце',
    order_title: 'Оформить Заказ',
    order_sub: 'Заполните данные ниже, чтобы начать восхождение',
    selected_pkg: 'Выбранный Пакет',
    not_selected: '— Пакет не выбран',
    select_eta: 'Выберите пакет для просмотра срока доставки',
    label_nickname: 'Никнейм в Sky',
    ph_nickname: 'Ваш игровой ник',
    label_code: 'Код Дружбы Sky',
    ph_code: 'например SKY-ABCD-1234',
    label_contact: 'Предпочтительный способ связи',
    label_username: 'Имя пользователя / ссылка',
    ph_username: '@username или ссылка на профиль',
    label_email: 'Email (для отслеживания заказа)',
    btn_place: '🌟 Оформить Заказ и Перейти к Оплате',
    order_note: 'Безопасная оплата • Отслеживание заказа • Telegram-уведомления',
    change: 'Изменить',
    dash_title: '✨ Ваш Кабинет',
    dash_sub: 'С возвращением, StarChild_77 • Заказ #SKH-4821',
    notif: '✅ Обновление: доставлено 40 сердец сегодня!',
    tg_title: 'Подключить Telegram',
    tg_sub: 'Мгновенные уведомления о доставке через @SkyHeartsBot',
    tg_btn: 'Подключить',
    label_ordered: 'Заказано Сердец',
    label_delivered: 'Доставлено',
    label_remaining: 'Осталось',
    label_eta: 'Срок',
    eta_val: 'Осталось 3 дня',
    progress_label: 'Прогресс Доставки',
    footer_copy: '© 2025 SkyHearts. Не аффилировано с thatgamecompany.',
    terms: 'Условия',
    privacy: 'Конфиденциальность',
    contact: 'Контакты',
    faq: 'FAQ',
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.dataset.i18nHtml !== undefined) {
      el.innerHTML = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  // Re-apply ETA text if set
  if (window._currentEtaText) {
    const el = document.getElementById('eta-text');
    if (el) el.textContent = window._currentEtaText[lang] || window._currentEtaText.en;
  }
}

function initLang() {
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
  setLang(currentLang);
}

// ---- FAQ ----
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const ans = q.nextElementSibling;
      const isOpen = ans.classList.contains('open');
      document.querySelectorAll('.faq-a').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
      });
      if (!isOpen) {
        ans.classList.add('open');
        q.querySelector('.faq-toggle').textContent = '−';
      }
    });
  });
}
