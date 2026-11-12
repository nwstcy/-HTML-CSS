/* Голос в интерфейсе: кнопка микрофона в поле ввода и кнопки «Послушать» у китайских названий.
   Вся работа с браузерным API — в speech.js, здесь только состояние кнопок и сообщения. */
import { el } from './dom.js';
import { state } from './state.js';
import { updateReady } from './composer.js';
import { toast } from './ui.js';
import {
  isRecognitionSupported, isSynthesisSupported, startListening, stopListening, isListening,
  speak, stopSpeaking, UNSUPPORTED_RECOGNITION, UNSUPPORTED_SYNTHESIS
} from './speech.js';

const mic = document.querySelector('#composer-mic');
let savedPlaceholder = '';

/* ---------- Голосовой ввод ---------- */
export function initVoiceInput() {
  if (!isRecognitionSupported()) {
    // API недоступно: кнопка остаётся видимой, но объясняет, почему не работает
    mic.classList.add('composer__mic--unavailable');
    mic.setAttribute('aria-disabled', 'true');
    mic.title = UNSUPPORTED_RECOGNITION;
  }
  mic.addEventListener('click', toggleListening);
}

function setListeningUi(on) {
  el.composer.classList.toggle('composer--listening', on);
  mic.setAttribute('aria-pressed', String(on));
  mic.setAttribute('aria-label', on ? 'Остановить запись' : 'Сказать голосом');
  if (on) {
    savedPlaceholder = el.input.placeholder;
    el.input.placeholder = 'Говорите…';
  } else if (el.input.placeholder === 'Говорите…') {
    el.input.placeholder = savedPlaceholder;
  }
}

function toggleListening() {
  if (!isRecognitionSupported()) {
    toast(UNSUPPORTED_RECOGNITION);
    return;
  }
  if (state.step === 'loading') return;
  if (isListening()) {
    stopListening();
    return;
  }
  stopSpeaking();
  startListening({
    lang: 'ru-RU',
    onStart: () => setListeningUi(true),
    onInterim: text => {
      el.input.value = text;
      updateReady();
    },
    onFinal: text => {
      // текст попадает в поле — пользователь проверяет его и отправляет сам
      el.input.value = text.charAt(0).toUpperCase() + text.slice(1);
      updateReady();
      el.input.focus();
    },
    onError: message => toast(message),
    onEnd: () => setListeningUi(false)
  });
}

export function cancelListening() {
  if (isListening()) stopListening();
}

/* ---------- Произношение китайского названия ---------- */
export const speechAvailable = isSynthesisSupported;

function setSpeakingUi(button, on) {
  button.classList.toggle('speak-button--active', on);
  button.setAttribute('aria-pressed', String(on));
}

export function toggleSpeak(button) {
  if (!isSynthesisSupported()) {
    toast(UNSUPPORTED_SYNTHESIS);
    return;
  }
  const wasActive = button.classList.contains('speak-button--active');
  document.querySelectorAll('.speak-button--active').forEach(b => setSpeakingUi(b, false));
  stopSpeaking();
  if (wasActive) return; // повторное нажатие останавливает звук

  speak(button.dataset.text, {
    onStart: () => setSpeakingUi(button, true),
    onEnd: () => setSpeakingUi(button, false),
    onError: message => toast(message)
  });
}

/* Останавливает звук при смене экрана */
export function silence() {
  stopSpeaking();
  document.querySelectorAll('.speak-button--active').forEach(b => setSpeakingUi(b, false));
}
