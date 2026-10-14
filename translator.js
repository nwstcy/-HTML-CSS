/* =========================================================
   CHINA BRAND — переводчик: состояния экрана по макетам
   empty brand → empty sphere → проверка данных → loading → результат
   + ошибки: «Название не удалось обработать», «Лимит генераций исчерпан»
   ========================================================= */

/* Демо-данные: какие названия умеет «подбирать» прототип */
const BRAND_LIBRARY = {
  bmw: {
    name: 'BMW',
    direct: 'BMW - аббревиатура, а не английское слово с самостоятельным буквальным значением; прямой перевод не предлагается.',
    adaptation: '<span class="hanzi-inline" lang="zh">宝马</span> уместно для автомобилей, но не похоже на английское произношение BMW. Естественный отраслевой вариант с узнаваемым звучанием не найден.',
    hanzi: '比伊艾姆达布尔优',
    pinyin: 'bǐyīàimǔdábùěryōu',
    sound: 'Передаёт английское чтение трёх букв BMW с допустимыми различиями китайских звуков. Знак <span class="hanzi-inline" lang="zh">优</span> означает превосходство.',
  },
  apple: {
    name: 'Apple',
    direct: '<span class="hanzi-inline" lang="zh">苹果</span> (píngguǒ) — «яблоко». Под этим названием компанию знают в Китае.',
    adaptation: '<span class="hanzi-inline" lang="zh">苹果</span> уже закрепилось за брендом и в сфере техники не вызывает лишних ассоциаций. Отдельная отраслевая адаптация не нужна.',
    hanzi: '艾普尔',
    pinyin: 'àipǔ’ěr',
    sound: 'Передаёт звучание английского Apple. Знак <span class="hanzi-inline" lang="zh">普</span> означает «всеобщий».',
  },
  ikea: {
    name: 'IKEA',
    direct: 'IKEA - аббревиатура из имени основателя и названий мест в Швеции; прямой перевод не предлагается.',
    adaptation: '<span class="hanzi-inline" lang="zh">宜家</span> (yíjiā) — «подходящий для дома». Название отсылает к строке из классической «Книги песен» и точно подходит мебели.',
    hanzi: '宜家',
    pinyin: 'yíjiā',
    sound: 'Близко к звучанию IKEA и одновременно сохраняет смысл «уютный дом».',
  },
  uniqlo: {
    name: 'Uniqlo',
    direct: 'Uniqlo — сокращение от Unique Clothing. Буквально <span class="hanzi-inline" lang="zh">独特服装</span> (dútè fúzhuāng) — «уникальная одежда».',
    adaptation: '<span class="hanzi-inline" lang="zh">优衣库</span>: <span class="hanzi-inline" lang="zh">优</span> — «превосходный», <span class="hanzi-inline" lang="zh">衣</span> — «одежда», <span class="hanzi-inline" lang="zh">库</span> — «склад». Подчёркивает качество и широкий ассортимент.',
    hanzi: '优衣库',
    pinyin: 'yōuyīkù',
    sound: 'Сохраняет звучание Uniqlo, и каждый знак работает на образ магазина одежды.',
  },
  salesforce: {
    name: 'Salesforce',
    direct: '<span class="hanzi-inline" lang="zh">销售力量</span> (xiāoshòu lìliàng) — «сила продаж». Звучит как описание, а не как бренд.',
    adaptation: '<span class="hanzi-inline" lang="zh">赛富时</span>: «соревнование», «богатство», «время». Ассоциации с ростом бизнеса подходят CRM-системе.',
    hanzi: '赛富时',
    pinyin: 'sàifùshí',
    sound: 'Передаёт звучание Salesforce, а знак <span class="hanzi-inline" lang="zh">富</span> означает «богатство».',
  },
  'coca-cola': {
    name: 'Coca-Cola',
    direct: 'Coca-Cola не имеет буквального значения; прямой перевод не предлагается.',
    adaptation: '<span class="hanzi-inline" lang="zh">可口可乐</span> (kěkǒu kělè) — «вкусно и радостно». Хрестоматийный пример удачной адаптации для напитков.',
    hanzi: '可口可乐',
    pinyin: 'kěkǒu kělè',
    sound: 'Почти полностью повторяет звучание Coca-Cola и при этом несёт позитивный смысл.',
  },
};

const BRAND_ALIASES = { 'coca cola': 'coca-cola', cocacola: 'coca-cola', 'бмв': 'bmw', 'икеа': 'ikea' };

const ICONS = {
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 10.6l5-5 1.4 1.4-5 5 5 5-1.4 1.4-5-5-5 5L5.6 17l5-5-5-5L7 5.6z" fill="currentColor"/></svg>',
  error: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1-7v2h2v-2zm0-8v6h2V7z" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-heart" d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm2 0h7a1 1 0 0 1 1 1v7h2V5H9zM5 9v10h10V9z" fill="currentColor"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 3.2a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4L9 19H5v-4zM15 7.4L6.9 15.5V17h1.5l8.1-8.1z" fill="currentColor"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h14a1 1 0 0 1 1 1v7h-2V6H6v3L1 5l5-4zm12 16H4a1 1 0 0 1-1-1v-7h2v6h13v-3l5 4-5 4z" fill="currentColor"/></svg>',
  external: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7.6 2H13V3h8v8h-2V6.4l-7 7L10.6 12z" fill="currentColor"/></svg>',
};

const LOADING_TIME = 4000;

/* ---------- Состояние переводчика ---------- */
const chatState = {
  view: 'brand',        /* brand | sphere | confirm | loading | result | error */
  brand: '',
  sphere: '',
  error: null,          /* 'unknown' | 'limit' */
  favorite: false,
};

/* Подсказки онбординга показываются по одному разу */
const seenTips = new Set();

const recentRequests = [
  { brand: 'Apple', sphere: 'smartphones and ecosystem' },
  { brand: 'IKEA', sphere: 'flat-pack furniture' },
  { brand: 'Uniqlo', sphere: 'casual apparel' },
  { brand: 'Salesforce', sphere: 'customer relationship management' },
];

const favorites = [
  { brand: 'IKEA', sphere: 'flat-pack furniture' },
  { brand: 'Salesforce', sphere: 'customer relationship management' },
];

let currentRequest = null;   /* запись текущего запроса в «Недавних» */
let loadingTimer = null;

/* ---------- Элементы ---------- */
const appScreen = document.getElementById('app');
const chat = appScreen.querySelector('[data-chat]');
const alertSlot = appScreen.querySelector('[data-alert]');
const promptForm = document.getElementById('request');
const promptInput = document.getElementById('prompt-input');
const promptLabel = appScreen.querySelector('[data-prompt-label]');
const chips = appScreen.querySelector('[data-chips]');
const submitButton = appScreen.querySelector('[data-submit]');
const stopButton = appScreen.querySelector('[data-stop]');
const stopAnchor = appScreen.querySelector('[data-tip-anchor="stop"]');
const steps = appScreen.querySelectorAll('[data-step]');
const historyList = appScreen.querySelector('[data-history]');
const favoritesList = appScreen.querySelector('[data-favorites]');

/* ---------- Вспомогательные функции ---------- */
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function findBrand(name) {
  const key = name.trim().toLowerCase();
  return BRAND_LIBRARY[BRAND_ALIASES[key] || key] || null;
}

function requestTitle(item) {
  return item.sphere ? item.brand + ', ' + item.sphere : item.brand;
}

/* Чёрная подсказка: плавно проявляется за 3 секунды (см. --tip-duration в CSS) */
function tipHtml(id, text, placement, options = {}) {
  if (seenTips.has(id)) return '';
  const vars = [];
  if (options.width) vars.push('--tip-width: ' + options.width + 'px');
  if (options.delay) vars.push('--tip-delay: ' + options.delay + 's');
  const style = vars.length ? ' style="' + vars.join('; ') + '"' : '';
  const close = options.noClose ? '' :
    '<button class="onboarding-tip__close" type="button" aria-label="Закрыть подсказку" data-tip-close="' + id + '">' + ICONS.close + '</button>';
  return '<div class="onboarding-tip onboarding-tip--' + placement + '" role="status" data-tip="' + id + '"' + style + '>' +
    '<p class="onboarding-tip__text">' + text + '</p>' + close + '</div>';
}

function setSteps(current) {
  steps.forEach((step) => {
    const number = Number(step.dataset.step);
    step.dataset.state = number < current ? 'done' : number === current ? 'current' : 'todo';
    if (number === current) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
}

/* ---------- Боковая панель ---------- */
function renderSidebar() {
  const items = currentRequest ? [currentRequest, ...recentRequests] : recentRequests;
  historyList.innerHTML = items.map((item, index) => {
    const current = item === currentRequest;
    return '<li><button class="request-history__item' + (current ? ' request-history__item--current' : '') +
      '" type="button" data-open-request="' + (current ? 'current' : index - (currentRequest ? 1 : 0)) + '"' +
      (current ? ' aria-current="true"' : '') + '>' + escapeHtml(requestTitle(item)) + '</button></li>';
  }).join('');

  favoritesList.innerHTML = favorites.map((item, index) =>
    '<li><button class="request-history__item" type="button" data-open-favorite="' + index + '">' +
    escapeHtml(requestTitle(item)) + '</button></li>').join('');
}

/* ---------- Отрисовка состояний ---------- */
function renderIntro() {
  return '<div class="chat__intro">' +
    '<p class="chat__intro-lead">Привет! Я подберу китайское название для вашего бренда: с иероглифами, произношением и объяснением, почему оно подходит вашей сфере.</p>' +
    '<div><p>Как это будет:</p><ol class="chat__intro-steps"><li>1. Вы называете бренд</li><li>2. Выбираете сферу</li>' +
    '<li>3. Я показываю результат: прямой перевод, адаптацию под сферу и вариант по звучанию.</li></ol></div>' +
    '<p>Понравившиеся названия можно сохранить в избранное.</p></div>';
}

function renderAnswer(text, withTools) {
  const tools = withTools
    ? '<div class="chat__answer-tools">' +
        '<button class="icon-button" type="button" aria-label="Скопировать бренд и сферу" data-copy-request>' + ICONS.copy + '</button>' +
        '<button class="icon-button" type="button" aria-label="Изменить бренд и сферу" data-edit-request>' + ICONS.pencil + '</button>' +
      '</div>' +
      tipHtml('edit', 'Можете отредактировать название бренда и сферу', 'below-end', { width: 242, delay: 0.6 })
    : '';
  return '<div class="chat__answer"><p class="chat__bubble">' + escapeHtml(text) + '</p>' + tools + '</div>';
}

function renderResult() {
  const data = findBrand(chatState.brand);
  return '<article class="adaptation-result" aria-labelledby="result-title">' +
    '<h1 class="adaptation-result__title" id="result-title">Адаптация для ' + escapeHtml(data.name) + ', ' + escapeHtml(chatState.sphere) + '</h1>' +
    '<div class="adaptation-result__sections">' +
      '<section class="result-option"><h2 class="result-option__title">Прямой перевод</h2><p>' + data.direct + '</p></section>' +
      '<section class="result-option"><h2 class="result-option__title">Адаптация с учётом сферы</h2><p>' + data.adaptation + '</p></section>' +
      '<section class="result-option"><h2 class="result-option__title">Вариант по звучанию</h2>' +
        '<p class="brand-name"><span class="brand-name__hanzi" lang="zh">' + data.hanzi + '</span> ' +
        '<span class="brand-name__pinyin" lang="zh-Latn">' + data.pinyin + '</span></p>' +
        '<p>' + data.sound + '</p></section>' +
    '</div>' +
    '<div class="result-actions">' +
      '<button class="icon-button" type="button" aria-label="Сохранить в «Мои бренды»" aria-pressed="' + chatState.favorite + '" data-favorite>' + ICONS.heart + '</button>' +
      '<button class="icon-button" type="button" aria-label="Скопировать результат" data-copy-result>' + ICONS.copy + '</button>' +
      '<button class="icon-button" type="button" aria-label="Сгенерировать заново" data-regenerate>' + ICONS.repeat + '</button>' +
      tipHtml('save', 'Можете сохранить результат в «Мои бренды»', 'below') +
    '</div></article>';
}

function renderAlert() {
  if (chatState.view !== 'error') return '';
  if (chatState.error === 'limit') {
    return '<div class="chat-alert" role="alert">' +
      '<span class="chat-alert__icon">' + ICONS.error + '</span>' +
      '<div class="chat-alert__content">' +
        '<p class="chat-alert__title">Лимит генераций исчерпан</p>' +
        '<p class="chat-alert__text">Продлите подписку</p>' +
        '<div class="chat-alert__actions">' +
          '<button class="chat-alert__link chat-alert__link--primary" type="button" data-retry>Обновить</button>' +
          '<a class="chat-alert__link" href="#pricing">Узнать о тарифах</a>' +
        '</div>' +
      '</div>' +
      '<button class="chat-alert__close" type="button" aria-label="Скрыть уведомление" data-alert-close>' + ICONS.close + '</button>' +
    '</div>';
  }
  return '<div class="chat-alert chat-alert--compact" role="alert">' +
    '<span class="chat-alert__icon">' + ICONS.error + '</span>' +
    '<div class="chat-alert__content"><p class="chat-alert__text">Название не удалось обработать, попробуйте снова</p></div>' +
    '<button class="chat-alert__link" type="button" data-retry>Обновить ' + ICONS.external + '</button>' +
    '<button class="chat-alert__close" type="button" aria-label="Скрыть уведомление" data-alert-close>' + ICONS.close + '</button>' +
  '</div>';
}

function render() {
  const { view, brand, sphere } = chatState;
  let html = '';

  /* Шаги мастера */
  if (view === 'brand') setSteps(1);
  else if (view === 'sphere') setSteps(2);
  else setSteps(3);

  /* Лента диалога */
  if (view === 'brand') {
    html = renderIntro() + '<p class="chat__question">Как называется ваш бренд?</p>';
  } else if (view === 'sphere') {
    html = '<p class="chat__question">Как называется ваш бренд?</p>' + renderAnswer(brand) +
      '<p class="chat__question">В какой сфере работает бренд?</p>';
  } else if (view === 'confirm') {
    html = '<p class="chat__question">Как называется ваш бренд?</p>' + renderAnswer(brand) +
      '<p class="chat__question">В какой сфере работает бренд?</p>' + renderAnswer(sphere, true) +
      '<p class="chat__summary">Бренд: <b>' + escapeHtml(brand) + '</b><br>Сфера: <b>' + escapeHtml(sphere) + '</b></p>' +
      '<div class="chat__confirm">' +
        '<button class="button button--primary" type="button" data-adapt>Адаптировать бренд</button>' +
        tipHtml('confirm', 'Нажмите, если данные верны', 'below', { delay: 0.3 }) +
      '</div>';
  } else if (view === 'loading') {
    html = '<p class="chat__status">Подбираем прямой перевод, сферу и звучание</p>';
  } else if (view === 'result') {
    html = renderResult();
  }
  chat.innerHTML = html;
  alertSlot.innerHTML = renderAlert();

  /* Поле ввода */
  const loading = view === 'loading';
  promptInput.value = '';
  promptInput.disabled = loading;
  chips.hidden = view !== 'sphere';
  submitButton.hidden = loading;
  stopButton.hidden = !loading;

  if (view === 'brand') {
    promptInput.placeholder = 'Напишите название бренда, например: BMW';
    promptLabel.textContent = 'Название бренда';
  } else if (view === 'sphere') {
    promptInput.placeholder = 'Выберите вариант или напишите свой на английском, например: skincare cosmetics';
    promptLabel.textContent = 'Сфера бренда';
  } else {
    promptInput.placeholder = '';
    promptLabel.textContent = 'Новый запрос: название бренда';
  }

  /* Подсказки у поля ввода */
  promptForm.querySelectorAll('[data-tip]').forEach((tip) => tip.remove());
  stopAnchor.querySelectorAll('[data-tip]').forEach((tip) => tip.remove());
  if (view === 'sphere') {
    promptForm.insertAdjacentHTML('beforeend', tipHtml('sphere', 'Выбирайте сферу из предложенных вариантов', 'above', { width: 386 }));
  }
  if (loading) {
    stopAnchor.insertAdjacentHTML('beforeend', tipHtml('stop', 'Остановить генерацию', 'above-center', { noClose: true }));
  }

  renderSidebar();
}

/* ---------- Переходы между состояниями ---------- */
function resetTranslator() {
  clearTimeout(loadingTimer);
  Object.assign(chatState, { view: 'brand', brand: '', sphere: '', error: null, favorite: false });
  currentRequest = null;
  render();
}

function submitBrand(value) {
  chatState.brand = value;
  chatState.view = 'sphere';
  currentRequest = { brand: value, sphere: '' };
  render();
}

function submitSphere(value) {
  chatState.sphere = value;
  chatState.view = 'confirm';
  currentRequest.sphere = value;
  render();
}

function startGeneration() {
  if (user.generationsLeft <= 0) {
    chatState.view = 'error';
    chatState.error = 'limit';
    render();
    return;
  }
  chatState.view = 'loading';
  chatState.error = null;
  render();

  loadingTimer = setTimeout(() => {
    if (!findBrand(chatState.brand)) {
      chatState.view = 'error';
      chatState.error = 'unknown';
      render();
      return;
    }
    user.generationsLeft -= 1;
    chatState.favorite = favorites.some((item) => item.brand.toLowerCase() === chatState.brand.toLowerCase());
    chatState.view = 'result';
    render();
  }, LOADING_TIME);
}

function stopGeneration() {
  clearTimeout(loadingTimer);
  chatState.view = 'confirm';
  render();
}

/* Открыть запрос из истории или избранного сразу с результатом */
function openSaved(item) {
  clearTimeout(loadingTimer);
  if (!findBrand(item.brand)) return;
  Object.assign(chatState, {
    view: 'result',
    brand: item.brand,
    sphere: item.sphere,
    error: null,
    favorite: favorites.includes(item) || favorites.some((fav) => fav.brand === item.brand),
  });
  currentRequest = null;
  render();
}

/* ---------- События ---------- */
promptForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = promptInput.value.trim();
  if (!value) {
    promptInput.focus();
    return;
  }
  if (chatState.view === 'brand') submitBrand(value);
  else if (chatState.view === 'sphere') submitSphere(value);
  else {
    /* После результата или ошибки поле начинает новый запрос */
    resetTranslator();
    submitBrand(value);
  }
});

/* Enter отправляет, Shift+Enter переносит строку */
promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    promptForm.requestSubmit();
  }
});

chips.addEventListener('click', (event) => {
  const chip = event.target.closest('.sphere-chip');
  if (chip) submitSphere(chip.textContent.trim());
});

stopButton.addEventListener('click', stopGeneration);

appScreen.addEventListener('click', (event) => {
  const target = event.target;

  const tipClose = target.closest('[data-tip-close]');
  if (tipClose) {
    seenTips.add(tipClose.dataset.tipClose);
    tipClose.closest('[data-tip]').remove();
    return;
  }

  if (target.closest('[data-adapt]')) {
    seenTips.add('confirm');
    seenTips.add('edit');
    startGeneration();
    return;
  }

  if (target.closest('[data-edit-request]')) {
    seenTips.add('edit');
    const brand = chatState.brand;
    chatState.view = 'brand';
    render();
    promptInput.value = brand;
    promptInput.focus();
    return;
  }

  if (target.closest('[data-copy-request]')) {
    copyText(chatState.brand + ', ' + chatState.sphere);
    return;
  }

  const favoriteButton = target.closest('[data-favorite]');
  if (favoriteButton) {
    seenTips.add('save');
    const tip = appScreen.querySelector('[data-tip="save"]');
    if (tip) tip.remove();
    chatState.favorite = !chatState.favorite;
    const index = favorites.findIndex((item) => item.brand.toLowerCase() === chatState.brand.toLowerCase());
    if (chatState.favorite && index === -1) favorites.unshift({ brand: chatState.brand, sphere: chatState.sphere });
    if (!chatState.favorite && index !== -1) favorites.splice(index, 1);
    favoriteButton.setAttribute('aria-pressed', String(chatState.favorite));
    renderSidebar();
    return;
  }

  if (target.closest('[data-copy-result]')) {
    copyText(chat.querySelector('.adaptation-result').innerText);
    return;
  }

  if (target.closest('[data-regenerate]') || target.closest('[data-retry]')) {
    startGeneration();
    return;
  }

  if (target.closest('[data-alert-close]')) {
    alertSlot.innerHTML = '';
    return;
  }

  if (target.closest('[data-new-request]')) {
    resetTranslator();
    promptInput.focus();
    return;
  }

  const savedRecent = target.closest('[data-open-request]');
  if (savedRecent && savedRecent.dataset.openRequest !== 'current') {
    openSaved(recentRequests[Number(savedRecent.dataset.openRequest)]);
    return;
  }

  const savedFavorite = target.closest('[data-open-favorite]');
  if (savedFavorite) {
    openSaved(favorites[Number(savedFavorite.dataset.openFavorite)]);
  }
});

function copyText(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
}

/* Боковая панель на мобильных */
const sidebarToggle = appScreen.querySelector('[data-sidebar-toggle]');
sidebarToggle.addEventListener('click', () => {
  const open = appScreen.classList.toggle('translator--sidebar-open');
  sidebarToggle.setAttribute('aria-expanded', String(open));
});

/* Вход в переводчик всегда начинается с пустого состояния */
function openTranslator() {
  showScreen('app', { force: true });
  resetTranslator();
}

render();
