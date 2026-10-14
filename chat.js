/* Экраны переводчика: бренд → сфера → проверка → генерация → результат, ошибки и история. */
import { FREE_LIMIT, TYPE_DELAY } from './data.js';
import { generate, canProcess } from './generator.js';
import { state, createSession, findSession, removeSession, markSeen, findGroup } from './state.js';
import { el, esc, icon, words, hanzi, appendMessage, scrollToNode, scrollToEnd, transition, removeAnimated } from './dom.js';
import { showTip, closeTip, removeAllTips, showAlert, clearAlert, toast, openModal, closeDrawer, copyText } from './ui.js';
import { setStep, setInput, focusInput } from './composer.js';
import { renderPicker } from './picker.js';
import { renderHistory } from './sidebar.js';

/* ---------- Экран 1: приветствие ---------- */
function renderIntro() {
  appendMessage('message--assistant', `
    <div class="intro__about"><div>
      <div class="intro">
        <div class="intro__block">
          <p class="message__text message__text--lead">${words('Привет! Я подберу китайское название для вашего бренда в три шага: с иероглифами, произношением и объяснением, почему оно подходит вашей сфере.')}</p>
          <div class="message__text">
            <p class="message__text">${words('Как это будет:', 300)}</p>
            <ol class="intro__steps">
              <li>${words('Вы называете бренд', 380)}</li>
              <li>${words('Выбираете сферу', 440)}</li>
              <li>${words('Я показываю результат: адаптацию под сферу и вариант по звучанию.', 500)}</li>
            </ol>
          </div>
        </div>
        <p class="message__text">${words('Понравившиеся названия можно сохранить в избранное.', 700)}</p>
      </div>
    </div></div>
    <h1 class="message__question">${words('Как называется ваш бренд?', 900)}</h1>`, 'intro');
}

export function startNew({ prefill = '' } = {}) {
  clearTimeout(state.busyTimer);
  transition(() => {
    state.current = createSession();
    state.picker = { path: [], selected: null };
    el.dialog.replaceChildren();
    el.alerts.replaceChildren();
    renderIntro();
    setStep('brand');
    setInput(prefill);
    renderHistory();
    el.scroll.scrollTop = 0;
  });
  closeDrawer();
  focusInput();
}

/* Первый экран без анимации перехода */
export function initChat() {
  state.current = createSession();
  renderIntro();
  setStep('brand');
  renderHistory();
}

/* ---------- Экран 2: выбор сферы ---------- */
function renderSphereQuestion(withPicker) {
  const title = withPicker ? words('В какой сфере работает бренд?') : 'В какой сфере работает бренд?';
  return appendMessage('message--assistant',
    `<h2 class="message__question">${title}</h2>${withPicker ? '<div class="sphere-picker"></div>' : ''}`,
    'sphere-question');
}

export function submitBrand(text) {
  const session = state.current;
  session.brand = text;
  session.inRecent = true;
  state.sessions.unshift(session);
  renderHistory();

  el.dialog.querySelector('.intro__about')?.classList.add('intro__about--hidden');
  appendMessage('message--user', `<p class="bubble">${esc(text)}</p>`);

  setTimeout(() => {
    const question = renderSphereQuestion(true);
    state.picker = { path: [], selected: null };
    setStep('sphere');
    renderPicker(question.querySelector('.sphere-picker'), 'forward');
    scrollToNode(question);
  }, 380);
}

export async function chooseSphere(name, group) {
  const session = state.current;
  session.sphere = name;
  session.sphereGroup = group || 'custom';
  session.result = null;
  session.seed = 0;
  state.picker.selected = null;
  el.applyBar.hidden = true;
  renderHistory();
  setStep('confirm');

  await removeAnimated(el.dialog.querySelector('.sphere-picker'));
  renderConfirmTail(session, true);
  scrollToEnd();
}

/* Сфера, введённая в поле вручную */
export function chooseTypedSphere(text) {
  const name = text.charAt(0).toUpperCase() + text.slice(1);
  chooseSphere(name, state.picker.path[0]?.id || findGroup(text));
}

/* Сфера, выбранная в сетке и подтверждённая кнопкой «Применить» */
export function applySelectedSphere() {
  if (state.picker.selected) chooseSphere(state.picker.selected, state.picker.path[0]?.id);
}

/* Редактирование: история диалога сохраняется, снова открывается выбор сферы */
export async function editSphere() {
  const session = state.current;
  closeTip('edit');
  removeAllTips();
  clearAlert();
  const question = el.dialog.querySelector('[data-role="sphere-question"]');
  if (!question) return;

  const after = [];
  for (let next = question.nextElementSibling; next; next = next.nextElementSibling) after.push(next);
  await Promise.all(after.map(node => removeAnimated(node)));

  session.sphere = '';
  session.sphereGroup = null;
  session.result = null;
  renderHistory();

  const picker = document.createElement('div');
  picker.className = 'sphere-picker';
  question.append(picker);
  state.picker = { path: [], selected: null };
  setStep('sphere');
  renderPicker(picker, 'forward');
  scrollToNode(question);
}

/* ---------- Экран 3: проверка данных ---------- */
function renderConfirmTail(session, withTips) {
  const user = appendMessage('message--user', `<p class="bubble">${esc(session.sphere)}</p>
    <div class="message__tools">
      <button class="tool-button" type="button" data-action="copy-request" aria-label="Скопировать запрос">${icon('copy', 16)}</button>
      <button class="tool-button" type="button" data-action="edit-request" aria-label="Изменить сферу">${icon('pencil', 16)}</button>
    </div>`);
  const brief = appendMessage('message--assistant', `
    <div class="brief">
      <p class="message__question">${words(`Бренд: ${session.brand}\nСфера: ${session.sphere}`, 150)}</p>
      <button class="button button--primary" type="button" data-action="generate">Адаптировать бренд</button>
    </div>`, 'brief');
  if (withTips) {
    showTip(brief.querySelector('.brief'), 'confirm', 'Нажмите, если данные верны', 'confirm', 900);
    showTip(user.querySelector('.message__tools'), 'edit', 'Можете отредактировать название бренда и сферу', 'edit', 1300);
  }
}

function renderConfirmScreen(session) {
  el.dialog.replaceChildren();
  appendMessage('message--assistant', '<h2 class="message__question">Как называется ваш бренд?</h2>');
  appendMessage('message--user', `<p class="bubble">${esc(session.brand)}</p>`);
  renderSphereQuestion(false);
  renderConfirmTail(session, false);
}

/* ---------- Экран 4: генерация ---------- */
export function generateResult() {
  const session = state.current;
  if (state.generations >= FREE_LIMIT) {
    showAlert('limit');
    return;
  }
  removeAllTips();
  markSeen('confirm');
  clearAlert();

  transition(() => {
    el.dialog.replaceChildren();
    appendMessage('message--assistant', '<p class="thinking__text">Подбираем адаптацию под сферу и звучание…</p>');
    setStep('loading');
    el.scroll.scrollTop = 0;
  });

  clearTimeout(state.busyTimer);
  state.busyTimer = setTimeout(() => {
    if (!canProcess(session.brand)) {
      transition(() => { el.dialog.replaceChildren(); setStep('error'); });
      showAlert('mistake');
      return;
    }
    state.generations += 1;
    session.result = generate(session, session.seed);
    transition(() => renderResult(session, true));
  }, TYPE_DELAY);
}

export function stopGeneration() {
  clearTimeout(state.busyTimer);
  transition(() => {
    renderConfirmScreen(state.current);
    setStep('confirm');
  });
  toast('Генерация остановлена');
}

export function regenerate(button) {
  button.classList.add('tool-button--spin');
  state.current.seed += 1;
  generateResult();
}

/* ---------- Экран 5: результат ---------- */
function likeButton(session) {
  const label = session.liked ? 'Убрать из «Моих брендов»' : 'Сохранить в «Мои бренды»';
  return `<button class="tool-button${session.liked ? ' tool-button--liked' : ''}" type="button" data-action="like" aria-pressed="${session.liked}" aria-label="${label}">${icon(session.liked ? 'heart-fill' : 'heart')}</button>`;
}

function variantHtml(label, data, delay, withTools, session) {
  return `<section class="variant">
      <h3 class="variant__label">${label}</h3>
      <div class="variant__body">
        <p class="variant__hanzi" lang="zh-Hans" aria-label="${esc(data.hanzi)}">${hanzi(data.hanzi, delay)}</p>
        <div class="variant__texts">
          <p class="variant__pinyin">${words(data.pinyin, delay + 250)}</p>
          <p class="variant__meaning">${words(data.text, delay + 350)}</p>
        </div>
        ${withTools ? `<div class="message__tools variant__tools">
          ${likeButton(session)}
          <button class="tool-button" type="button" data-action="copy-result" aria-label="Скопировать результат">${icon('copy')}</button>
          <button class="tool-button" type="button" data-action="regenerate" aria-label="Сгенерировать другой вариант">${icon('loop')}</button>
        </div>` : ''}
      </div>
    </section>`;
}

function renderResult(session, withTips) {
  const { adaptation, sound } = session.result;
  el.dialog.replaceChildren();
  const node = appendMessage('message--assistant', `
    <article class="adaptation">
      <h2 class="adaptation__title">${words(`Адаптация для ${session.brand}, ${session.sphere}`)}</h2>
      <div class="adaptation__variants">
        ${variantHtml('Адаптация с учётом сферы', adaptation, 200, false, session)}
        ${variantHtml('Вариант по звучанию', sound, 900, true, session)}
      </div>
    </article>`);
  setStep('result');
  renderHistory();
  el.scroll.scrollTop = 0;
  if (withTips) {
    showTip(node.querySelector('.variant__tools'), 'save', 'Можете сохранить результат. Он появится слева в поле «Мои бренды»', 'save', 1900);
    showTip(el.newRequestWrap, 'sidebar', 'Нажмите «Новый запрос», чтобы адаптировать другой бренд', 'sidebar', 2600);
  }
}

export function toggleLike(button) {
  const session = state.current;
  closeTip('save');
  session.liked = !session.liked;
  button.outerHTML = likeButton(session);
  if (!session.liked && !session.inRecent) removeSession(session);
  renderHistory();
}

export function copyRequest() {
  const { brand, sphere } = state.current;
  copyText(`${brand}, ${sphere}`);
}

export function copyResult() {
  const { brand, result } = state.current;
  copyText(`${brand} → ${result.adaptation.hanzi} (${result.adaptation.pinyin}); по звучанию: ${result.sound.hanzi} (${result.sound.pinyin})`);
}

/* ---------- История ---------- */
export function openSession(id) {
  const session = findSession(id);
  if (!session) return;
  clearTimeout(state.busyTimer);
  closeDrawer();
  transition(() => {
    state.current = session;
    el.alerts.replaceChildren();
    if (session.result) {
      renderResult(session, false);
    } else if (session.sphere) {
      renderConfirmScreen(session);
      setStep('confirm');
    } else {
      el.dialog.replaceChildren();
      appendMessage('message--assistant', '<h2 class="message__question">Как называется ваш бренд?</h2>');
      appendMessage('message--user', `<p class="bubble">${esc(session.brand)}</p>`);
      const question = renderSphereQuestion(true);
      state.picker = { path: [], selected: null };
      setStep('sphere');
      renderPicker(question.querySelector('.sphere-picker'), 'forward');
    }
    renderHistory();
  });
}

export function askDelete(id) {
  openModal({
    title: 'Хотите удалить?',
    text: 'Адаптация бренда будет удалена из истории. В «Моих брендах» она останется.',
    confirm: 'Удалить',
    danger: true,
    onConfirm: async () => {
      const session = findSession(id);
      if (!session) return;
      await removeAnimated(el.recentList.querySelector(`[data-id="${id}"]`), 'history__item--leaving');
      session.inRecent = false;
      if (!session.liked || !session.result) removeSession(session);
      renderHistory();
      if (session === state.current) startNew();
    }
  });
}

/* ---------- Ошибки и тарифы ---------- */
export function retryAfterMistake() {
  const session = state.current;
  const brand = session?.brand || '';
  if (session) {
    session.inRecent = false;
    removeSession(session);
  }
  startNew({ prefill: brand });
}

export function renewPlan() {
  state.generations = 0;
  clearAlert();
  toast(`Подписка продлена: доступно ${FREE_LIMIT} генерации`);
}

export function showPlans() {
  openModal({
    title: 'Тарифы China Brand',
    text: `Бесплатно — ${FREE_LIMIT} адаптации. Pro — без ограничений.`,
    confirm: 'Подключить Pro',
    onConfirm: renewPlan
  });
}
