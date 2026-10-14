/* Точка входа: подключает модули и обрабатывает события пользователя. */
import { el, $ } from './dom.js';
import { state } from './state.js';
import { updateReady, takeInput } from './composer.js';
import { handlePickerClick } from './picker.js';
import { closeTip, clearAlert, closeModal, openDrawer, closeDrawer } from './ui.js';
import {
  initChat, startNew, submitBrand, chooseTypedSphere, applySelectedSphere, editSphere,
  generateResult, stopGeneration, regenerate, toggleLike, copyRequest, copyResult,
  openSession, askDelete, retryAfterMistake, renewPlan, showPlans
} from './chat.js';

/* ---------- Ввод текста и отправка формы ---------- */
el.input.addEventListener('input', updateReady);

el.composer.addEventListener('submit', event => {
  event.preventDefault();
  if (state.step === 'loading') {
    stopGeneration();
    return;
  }
  const text = takeInput();
  if (!text) {
    el.input.focus();
    return;
  }
  clearAlert();

  if (state.step === 'brand') {
    submitBrand(text);
  } else if (state.step === 'sphere') {
    chooseTypedSphere(text);
  } else {
    // на экранах проверки и результата новый текст начинает новый запрос
    startNew();
    setTimeout(() => submitBrand(text), 420);
  }
});

el.apply.addEventListener('click', applySelectedSphere);

/* ---------- Клики в диалоге (делегирование по data-action) ---------- */
const dialogActions = {
  generate: () => generateResult(),
  'copy-request': () => copyRequest(),
  'edit-request': () => editSphere(),
  'copy-result': () => copyResult(),
  like: button => toggleLike(button),
  regenerate: button => regenerate(button)
};

el.dialog.addEventListener('click', event => {
  handlePickerClick(event);
  const button = event.target.closest('[data-action]');
  if (!button || !state.current) return;
  dialogActions[button.dataset.action]?.(button);
});

/* ---------- Уведомления об ошибках ---------- */
const alertActions = { retry: retryAfterMistake, renew: renewPlan, plans: showPlans };

el.alerts.addEventListener('click', event => {
  const kind = event.target.closest('[data-alert]')?.dataset.alert;
  alertActions[kind]?.();
});

/* ---------- Боковая панель ---------- */
$('#new-request').addEventListener('click', () => {
  closeTip('sidebar');
  startNew();
});
$('#topbar-new').addEventListener('click', () => startNew());
$('#logo').addEventListener('click', event => {
  event.preventDefault();
  startNew();
});
$('#plan-button').addEventListener('click', showPlans);

el.history.addEventListener('click', event => {
  const remove = event.target.closest('[data-delete]');
  const open = event.target.closest('[data-open]');
  if (remove) askDelete(Number(remove.dataset.delete));
  else if (open) openSession(Number(open.dataset.open));
});

el.menuOpen.addEventListener('click', openDrawer);
$('#sidebar-close').addEventListener('click', closeDrawer);
el.backdrop.addEventListener('click', closeDrawer);

/* ---------- Модальное окно ---------- */
el.modal.addEventListener('click', event => {
  if (event.target.closest('[data-close-modal]')) closeModal();
});

$('#modal-confirm').addEventListener('click', () => {
  const action = state.modalAction;
  closeModal();
  action?.();
});

/* ---------- Клавиатура ---------- */
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!el.modal.hidden) closeModal();
  else closeDrawer();
});

/* ---------- Старт ---------- */
initChat();
