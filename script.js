/* =========================================================
   CHINA BRAND — навигация по экранам и сценарий подписки
   «Адаптировать бренд» → регистрация → тарифы и оплата → переводчик
   ========================================================= */

const SCREENS = ['about', 'more', 'pricing', 'app'];

/* Состояние пользователя живёт только в памяти страницы (демо) */
const user = {
  registered: false,
  subscribed: false,
  plan: null,          /* 'unlimited' | 'single' */
  generationsLeft: Infinity,
};

/* Что сделать после успешной регистрации */
let afterAuth = null;

/* ---------- Переключение экранов ---------- */
function showScreen(name, options = {}) {
  if (!SCREENS.includes(name)) name = 'about';

  /* В переводчик пускаем только после регистрации и оплаты */
  if (name === 'app' && !options.force) {
    startAdaptation();
    return;
  }

  document.querySelectorAll('[data-screen]').forEach((screen) => {
    if (screen === document.body) return;
    screen.hidden = screen.dataset.screen !== name;
  });
  document.body.dataset.screen = name;

  if (location.hash !== '#' + name) {
    try { history.replaceState(null, '', '#' + name); } catch (error) { /* адрес не обязателен */ }
  }
  window.scrollTo(0, 0);
}

/* Все ссылки вида href="#screen" переключают экраны */
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.dataset.action) return;
  const target = link.getAttribute('href').slice(1);
  if (!SCREENS.includes(target)) return;
  event.preventDefault();
  showScreen(target);
});

window.addEventListener('hashchange', () => {
  showScreen(location.hash.slice(1));
});

/* ---------- Главный сценарий ---------- */
function startAdaptation() {
  if (!user.registered) {
    openAuth('register', startAdaptation);
    return;
  }
  if (!user.subscribed) {
    showScreen('pricing');
    return;
  }
  openTranslator();
}

document.querySelectorAll('[data-action="start"]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    startAdaptation();
  });
});

document.querySelector('[data-action="account"]').addEventListener('click', () => {
  if (!user.registered) openAuth('login', null);
  else showScreen('pricing');
});

/* ---------- Модальные окна ---------- */
function openDialog(dialog) {
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeDialog(dialog) {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

/* Крестика нет (как в макете): модалка закрывается кликом по затемнению вокруг окна или клавишей Esc */
document.querySelectorAll('.modal').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
});

/* ---------- Регистрация и вход ---------- */
const authDialog = document.getElementById('auth-dialog');
const authForm = authDialog.querySelector('.auth-form');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const passwordHint = authForm.querySelector('[data-password-hint]');
const emailError = authForm.querySelector('[data-error="email"]');

function setAuthMode(mode) {
  authForm.dataset.mode = mode;
  authForm.querySelectorAll('[data-auth-text-' + mode + ']').forEach((el) => {
    el.textContent = el.getAttribute('data-auth-text-' + mode);
  });
  authForm.querySelectorAll('[data-auth-only]').forEach((el) => {
    el.hidden = el.dataset.authOnly !== mode;
  });
  passwordInput.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  resetAuthErrors();
}

function resetAuthErrors() {
  emailError.hidden = true;
  emailInput.parentElement.classList.remove('input-group--invalid');
  passwordInput.parentElement.classList.remove('input-group--invalid');
  passwordHint.classList.remove('form-hint--invalid');
}

function openAuth(mode, next) {
  afterAuth = next;
  setAuthMode(mode);
  openDialog(authDialog);
  emailInput.focus();
}

authForm.querySelectorAll('[data-auth-switch]').forEach((button) => {
  button.addEventListener('click', () => setAuthMode(button.dataset.authSwitch));
});

authForm.querySelector('[data-forgot]').addEventListener('click', (event) => {
  event.preventDefault();
});

authForm.querySelector('[data-toggle-password]').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const visible = passwordInput.type === 'password';
  passwordInput.type = visible ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(visible));
  button.setAttribute('aria-label', visible ? 'Скрыть пароль' : 'Показать пароль');
});

authForm.addEventListener('input', resetAuthErrors);

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  const password = passwordInput.value;
  const passwordOk = authForm.dataset.mode === 'login'
    ? password.length > 0
    : password.length >= 8 && /\d/.test(password);

  emailError.hidden = emailOk;
  emailInput.parentElement.classList.toggle('input-group--invalid', !emailOk);
  passwordInput.parentElement.classList.toggle('input-group--invalid', !passwordOk);
  passwordHint.classList.toggle('form-hint--invalid', !passwordOk);
  if (!emailOk || !passwordOk) return;

  user.registered = true;
  document.querySelector('[data-action="account"]').classList.add('user-avatar--signed-in');
  closeDialog(authDialog);
  authForm.reset();

  const next = afterAuth;
  afterAuth = null;
  if (next) next();
});

/* ---------- Тарифы и оплата ---------- */
const paymentDialog = document.getElementById('payment-dialog');
const planLabel = paymentDialog.querySelector('[data-payment-plan]');
const amountLabel = paymentDialog.querySelector('[data-payment-amount]');
const paySubmit = paymentDialog.querySelector('[data-payment-submit]');
const payError = paymentDialog.querySelector('[data-payment-error]');
const cardInput = document.getElementById('card-number');
const expiryInput = document.getElementById('card-expiry');
const cvcInput = document.getElementById('card-cvc');

let selectedPlan = 'unlimited';

function openPayment(button) {
  selectedPlan = button.dataset.amount === '99' ? 'single' : 'unlimited';
  planLabel.textContent = button.dataset.plan;
  amountLabel.textContent = button.dataset.amountLabel;
  paySubmit.textContent = 'Оплатить ' + button.dataset.amount + ' ₽';
  payError.hidden = true;
  openDialog(paymentDialog);
  cardInput.focus();
}

document.querySelectorAll('[data-plan]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!user.registered) {
      openAuth('register', () => openPayment(button));
      return;
    }
    openPayment(button);
  });
});

cardInput.addEventListener('input', () => {
  const digits = cardInput.value.replace(/\D/g, '').slice(0, 16);
  cardInput.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  payError.hidden = true;
});

expiryInput.addEventListener('input', () => {
  const digits = expiryInput.value.replace(/\D/g, '').slice(0, 4);
  expiryInput.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
});

cvcInput.addEventListener('input', () => {
  cvcInput.value = cvcInput.value.replace(/\D/g, '').slice(0, 3);
});

paymentDialog.querySelector('.payment-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const cardOk = cardInput.value.replace(/\D/g, '').length === 16;
  const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value);
  const cvcOk = cvcInput.value.length === 3;

  payError.hidden = cardOk;
  [[cardInput, cardOk], [expiryInput, expiryOk], [cvcInput, cvcOk]].forEach(([input, ok]) => {
    input.classList.toggle('text-field--invalid', !ok);
  });
  if (!cardOk || !expiryOk || !cvcOk) return;

  /* Демо: реальная оплата не проводится */
  user.subscribed = true;
  user.plan = selectedPlan;
  user.generationsLeft = selectedPlan === 'single' ? 1 : Infinity;
  closeDialog(paymentDialog);
  event.target.reset();
  openTranslator();
});

/* Крестик у предупреждения на экране «Узнать больше» */
document.querySelectorAll('[data-dismiss]').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('[data-dismissible]').hidden = true;
  });
});

/* Логика переводчика — в translator.js */

/* ---------- Старт: экран из адреса ---------- */
showScreen(location.hash.slice(1) || 'about');
