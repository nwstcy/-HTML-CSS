/* Поле ввода внизу экрана: подсказка-плейсхолдер, состояние «генерация», активность кнопки. */
import { el } from './dom.js';
import { state } from './state.js';

const PLACEHOLDERS = {
  brand: 'Напишите название бренда, например: BMW',
  sphere: 'Или введите название сферы вручную',
  confirm: '',
  result: '',
  error: '',
  loading: ''
};

/* Переключает шаг сценария и обновляет поле ввода под него */
export function setStep(step) {
  state.step = step;
  const next = PLACEHOLDERS[step];
  if (el.input.placeholder !== next) {
    el.composer.classList.add('composer--placeholder-swap');
    setTimeout(() => {
      el.input.placeholder = next;
      el.composer.classList.remove('composer--placeholder-swap');
    }, 160);
  }
  const busy = step === 'loading';
  el.composer.classList.toggle('composer--busy', busy);
  el.input.disabled = busy;
  el.send.setAttribute('aria-label', busy ? 'Остановить генерацию' : 'Отправить');
  el.applyBar.hidden = !(step === 'sphere' && state.picker.selected);
  updateReady();
}

/* Стрелка отправки темнеет, когда в поле есть текст */
export function updateReady() {
  el.composer.classList.toggle('composer--ready', el.input.value.trim().length > 0 && state.step !== 'loading');
}

export function setInput(value) {
  el.input.value = value;
  updateReady();
}

export function takeInput() {
  const text = el.input.value.trim();
  setInput('');
  return text;
}

export function focusInput() {
  setTimeout(() => el.input.focus({ preventScroll: true }), 50);
}
