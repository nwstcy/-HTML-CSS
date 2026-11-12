/* Обёртка над Web Speech API.
   SpeechRecognition — голосовой ввод названия бренда (русский язык).
   speechSynthesis — произношение китайского названия (путунхуа, zh-CN).
   Модуль ничего не знает об интерфейсе: только проверяет поддержку, запускает API
   и переводит ошибки браузера в понятные сообщения. */

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

/* ---------- Проверка поддержки ---------- */
export const isRecognitionSupported = () => Boolean(Recognition) && window.isSecureContext;
export const isSynthesisSupported = () => Boolean(synth) && typeof window.SpeechSynthesisUtterance === 'function';

/* Тексты ошибок распознавания (коды из SpeechRecognitionErrorEvent.error) */
const RECOGNITION_ERRORS = {
  'not-allowed': 'Нет доступа к микрофону. Разрешите его в настройках браузера для этого сайта.',
  'service-not-allowed': 'Браузер запретил голосовой ввод на этой странице.',
  'audio-capture': 'Микрофон не найден. Проверьте, что он подключён.',
  'no-speech': 'Ничего не расслышали. Нажмите на микрофон и произнесите название ещё раз.',
  network: 'Для распознавания речи нужен интернет. Проверьте подключение.',
  'language-not-supported': 'Браузер не умеет распознавать русскую речь.',
  'bad-grammar': 'Не удалось распознать речь. Попробуйте ещё раз.'
};

export const UNSUPPORTED_RECOGNITION = window.isSecureContext
  ? 'Голосовой ввод не поддерживается в этом браузере. Попробуйте Chrome, Edge или Safari.'
  : 'Голосовой ввод работает только на защищённом соединении (https).';

export const UNSUPPORTED_SYNTHESIS = 'Озвучка не поддерживается в этом браузере.';

/* ---------- Распознавание речи ---------- */
let recognition = null;

/**
 * Запускает распознавание. Колбэки:
 * onStart(), onInterim(text) — промежуточный текст, onFinal(text) — итог,
 * onError(message), onEnd() — вызывается всегда, когда запись закончилась.
 */
export function startListening({ lang = 'ru-RU', onStart, onInterim, onFinal, onError, onEnd } = {}) {
  if (!isRecognitionSupported()) {
    onError?.(UNSUPPORTED_RECOGNITION);
    onEnd?.();
    return;
  }
  stopListening();

  recognition = new Recognition();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  let finalText = '';

  recognition.onstart = () => onStart?.();

  recognition.onresult = event => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += transcript;
      else interim += transcript;
    }
    onInterim?.((finalText + interim).trim());
  };

  recognition.onerror = event => {
    if (event.error === 'aborted') return; // пользователь сам остановил запись
    onError?.(RECOGNITION_ERRORS[event.error] || 'Не удалось распознать речь. Попробуйте ещё раз.');
  };

  recognition.onend = () => {
    recognition = null;
    const text = finalText.trim();
    if (text) onFinal?.(text);
    onEnd?.();
  };

  try {
    recognition.start();
  } catch {
    recognition = null;
    onError?.('Не удалось включить микрофон. Попробуйте ещё раз.');
    onEnd?.();
  }
}

export function stopListening() {
  if (recognition) recognition.stop();
}

export const isListening = () => recognition !== null;

/* ---------- Синтез речи ---------- */
let voices = [];

function loadVoices() {
  if (!isSynthesisSupported()) return;
  voices = synth.getVoices();
}

if (isSynthesisSupported()) {
  loadVoices();
  // в Chrome список голосов приходит асинхронно
  synth.addEventListener?.('voiceschanged', loadVoices);
}

/* Китайский голос: сначала материковый (zh-CN), затем любой zh-* */
function findChineseVoice() {
  return voices.find(v => /^zh[-_]CN/i.test(v.lang))
    || voices.find(v => /^cmn/i.test(v.lang))
    || voices.find(v => /^zh/i.test(v.lang))
    || null;
}

/**
 * Произносит текст по-китайски. Колбэки: onStart(), onEnd(), onError(message).
 */
export function speak(text, { rate = 0.8, onStart, onEnd, onError } = {}) {
  if (!isSynthesisSupported()) {
    onError?.(UNSUPPORTED_SYNTHESIS);
    onEnd?.();
    return;
  }
  loadVoices();
  const voice = findChineseVoice();
  // голоса загружены, но китайского среди них нет — браузер прочитал бы иероглифы неправильно
  if (voices.length > 0 && !voice) {
    onError?.('В системе нет китайского голоса. Его можно добавить в настройках языка и речи вашего устройства.');
    onEnd?.();
    return;
  }

  synth.cancel(); // одновременно звучит только одно название

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  try {
    if (voice) utterance.voice = voice;
  } catch {
    /* голос не подошёл — браузер выберет китайский голос по utterance.lang */
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = event => {
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      onError?.('Не удалось воспроизвести произношение. Попробуйте ещё раз.');
    }
    onEnd?.();
  };

  synth.speak(utterance);
}

export function stopSpeaking() {
  if (isSynthesisSupported()) synth.cancel();
}
