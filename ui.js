/* Общие элементы интерфейса: подсказки, уведомления, тост, модальное окно, меню, копирование. */
import { el, $, esc, icon, removeAnimated } from './dom.js';
import { state, markSeen } from './state.js';

/* ---------- Подсказки онбординга ---------- */
export function showTip(anchor, key, text, modifier, delay = 0) {
  if (state.seen[key] || !anchor) return null;
  const node = document.createElement('div');
  node.className = `tooltip tooltip--below tooltip--${modifier}`;
  node.setAttribute('role', 'note');
  node.dataset.tip = key;
  node.style.setProperty('--delay', `${delay}ms`);
  node.innerHTML = `<span>${esc(text)}</span><button class="tooltip__close" type="button" aria-label="Закрыть подсказку">${icon('close', 20)}</button>`;
  node.querySelector('.tooltip__close').addEventListener('click', event => {
    event.stopPropagation();
    closeTip(key);
  });
  anchor.append(node);
  return node;
}

export function closeTip(key) {
  markSeen(key);
  document.querySelectorAll(`[data-tip="${key}"]`).forEach(node => removeAnimated(node, 'tooltip--leaving'));
}

export function removeAllTips() {
  document.querySelectorAll('[data-tip]').forEach(node => node.remove());
}

/* ---------- Уведомления над полем ввода ---------- */
export function showAlert(kind) {
  el.alerts.innerHTML = '';
  const node = document.createElement('div');
  node.setAttribute('role', 'alert');
  if (kind === 'mistake') {
    node.className = 'alert';
    node.innerHTML = `${icon('warning', 20, 'alert__icon')}<p class="alert__text">Название не удалось обработать, попробуйте снова</p>
      <span class="alert__retry"><button class="alert__link" type="button" data-alert="retry">Обновить</button>${icon('loop', 16)}</span>`;
  } else {
    node.className = 'alert alert--limit';
    node.innerHTML = `${icon('warning', 20, 'alert__icon')}<div class="alert__content">
        <div class="alert__texts"><p class="alert__title">Лимит генераций исчерпан</p><p class="alert__text">Вам необходимо продлить подписку</p></div>
        <div class="alert__actions">
          <button class="alert__link alert__link--underline" type="button" data-alert="renew">Обновить</button>
          <button class="alert__link" type="button" data-alert="plans">Узнать о тарифах</button>
        </div></div>`;
  }
  el.alerts.append(node);
}

export function clearAlert() {
  const node = el.alerts.firstElementChild;
  if (node) removeAnimated(node, 'alert--leaving');
}

/* ---------- Тост ---------- */
let toastTimer;
export function toast(text) {
  el.toast.textContent = text;
  el.toast.classList.add('toast--visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('toast--visible'), 2400);
}

/* ---------- Модальное окно ---------- */
export function openModal({ title, text, confirm, danger = false, onConfirm }) {
  $('#modal-title').textContent = title;
  $('#modal-text').textContent = text;
  const button = $('#modal-confirm');
  button.textContent = confirm;
  button.className = `button ${danger ? 'button--danger' : 'button--primary'}`;
  state.modalAction = onConfirm;
  el.modal.hidden = false;
  el.modal.classList.remove('modal--closing');
  button.focus();
}

export function closeModal() {
  if (el.modal.hidden) return;
  el.modal.classList.add('modal--closing');
  setTimeout(() => {
    el.modal.hidden = true;
    el.modal.classList.remove('modal--closing');
  }, 180);
}

/* ---------- Мобильное меню ---------- */
export function openDrawer() {
  el.sidebar.classList.add('sidebar--open');
  el.backdrop.hidden = false;
  el.menuOpen.setAttribute('aria-expanded', 'true');
}

export function closeDrawer() {
  el.sidebar.classList.remove('sidebar--open');
  el.backdrop.hidden = true;
  el.menuOpen.setAttribute('aria-expanded', 'false');
}

/* ---------- Буфер обмена ---------- */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Скопировано');
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.append(area);
    area.select();
    try { document.execCommand('copy'); toast('Скопировано'); } catch { toast('Не удалось скопировать'); }
    area.remove();
  }
}
