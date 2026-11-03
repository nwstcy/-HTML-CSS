import { useEffect, useRef, useState } from 'react';
import { FREE_LIMIT, TYPE_DELAY } from '../data/data.js';
import { generate, canProcess } from '../lib/generator.js';
import { loadHistory, saveHistory } from '../lib/storage.js';
import { findGroup } from '../lib/spheres.js';

/* Шаги сценария: brand → sphere → confirm → loading → result | error */
const EMPTY_PICKER = { path: [], selected: null, direction: 'forward' };

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Всё состояние переводчика: история запросов, текущий запрос, шаг сценария,
 * выбор сферы, лимит генераций и уведомление об ошибке.
 * notify(text) — показать короткое сообщение пользователю.
 */
export function useTranslator({ notify, dismissTip }) {
  const [sessions, setSessions] = useState(loadHistory);
  const lastId = useRef(null);
  if (lastId.current === null) lastId.current = sessions.reduce((max, s) => Math.max(max, s.id), 0);

  const makeSession = (patch = {}) => ({
    id: ++lastId.current, brand: '', sphere: '', sphereGroup: null,
    result: null, seed: 0, liked: false, inRecent: false, ...patch
  });

  const [draft, setDraft] = useState(() => makeSession());
  const [currentId, setCurrentId] = useState(draft.id);
  const [step, setStep] = useState('brand');
  const [picker, setPicker] = useState(EMPTY_PICKER);
  const [input, setInput] = useState('');
  const [alert, setAlert] = useState(null);           // null | 'mistake' | 'limit'
  const [generations, setGenerations] = useState(0);
  const [showTips, setShowTips] = useState(false);    // подсказки только в свежем сценарии
  const [fresh, setFresh] = useState(true);           // запрос начат заново → показываем приветствие
  const [screenKey, setScreenKey] = useState(0);      // смена экрана → анимация появления
  const [focusKey, setFocusKey] = useState(0);        // запрос фокуса на поле ввода
  const timer = useRef(null);
  const storageWarned = useRef(false);

  const current = sessions.find(s => s.id === currentId) ?? draft;

  /* История сохраняется в localStorage при каждом изменении */
  useEffect(() => {
    if (!saveHistory(sessions) && !storageWarned.current) {
      storageWarned.current = true;
      notify('История не сохранится после перезагрузки: браузер запретил хранить данные');
    }
  }, [sessions, notify]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const updateSession = (id, patch) => {
    setSessions(list => list.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const nextScreen = () => setScreenKey(k => k + 1);
  const focusInput = () => setFocusKey(k => k + 1);

  /* ---------- Новый запрос ---------- */
  function startNew(prefill = '') {
    clearTimeout(timer.current);
    const session = makeSession();
    setDraft(session);
    setCurrentId(session.id);
    setStep('brand');
    setPicker(EMPTY_PICKER);
    setAlert(null);
    setShowTips(false);
    setFresh(true);
    setInput(prefill);
    nextScreen();
    focusInput();
  }

  /* ---------- Шаг 1: бренд ---------- */
  function submitBrand(text, { asNewRequest = false } = {}) {
    const base = asNewRequest ? makeSession() : current;
    const session = { ...base, brand: text, inRecent: true };
    setSessions(list => [session, ...list.filter(s => s.id !== session.id)]);
    setCurrentId(session.id);
    setPicker(EMPTY_PICKER);
    setStep('sphere');
    if (asNewRequest) {
      setShowTips(false);
      setFresh(true);
      nextScreen();
    }
  }

  /* ---------- Шаг 2: сфера ---------- */
  const openSphere = node => setPicker(p => ({ path: [...p.path, node], selected: null, direction: 'forward' }));
  const goBack = () => setPicker(p => ({ path: p.path.slice(0, -1), selected: null, direction: 'back' }));
  const goToDepth = depth => setPicker(p => ({ path: p.path.slice(0, depth), selected: null, direction: 'back' }));
  const selectSphere = name => setPicker(p => ({ ...p, selected: name }));

  function chooseSphere(name, group) {
    updateSession(current.id, { sphere: name, sphereGroup: group || 'custom', result: null, seed: 0 });
    setPicker(EMPTY_PICKER);
    setStep('confirm');
    setShowTips(true);
  }

  const applySphere = () => {
    if (picker.selected) chooseSphere(picker.selected, picker.path[0]?.id);
  };

  /* Редактирование: история диалога остаётся, снова открывается выбор сферы */
  function editSphere() {
    dismissTip('edit');
    updateSession(current.id, { sphere: '', sphereGroup: null, result: null });
    setPicker(EMPTY_PICKER);
    setAlert(null);
    setStep('sphere');
  }

  /* ---------- Шаг 3–4: генерация ---------- */
  function runGeneration(session) {
    if (generations >= FREE_LIMIT) {
      setAlert('limit');
      return;
    }
    dismissTip('confirm');
    setAlert(null);
    setStep('loading');
    nextScreen();

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!canProcess(session.brand)) {
        setStep('error');
        setAlert('mistake');
        nextScreen();
        return;
      }
      updateSession(session.id, { result: generate(session, session.seed), seed: session.seed, feedback: null });
      setGenerations(g => g + 1);
      setStep('result');
      nextScreen();
    }, TYPE_DELAY);
  }

  const startGeneration = () => runGeneration(current);

  const regenerate = () => runGeneration({ ...current, seed: current.seed + 1 });

  function stopGeneration() {
    clearTimeout(timer.current);
    setStep('confirm');
    setShowTips(false);
    nextScreen();
    notify('Генерация остановлена');
  }

  /* ---------- Результат и история ---------- */
  function toggleLike() {
    dismissTip('save');
    updateSession(current.id, { liked: !current.liked });
  }

  /* ответ сервера на отзыв сохраняется вместе с запросом */
  const saveFeedback = (id, feedback) => updateSession(id, { feedback });

  function openSession(id) {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    clearTimeout(timer.current);
    setCurrentId(id);
    setPicker(EMPTY_PICKER);
    setAlert(null);
    setShowTips(false);
    setFresh(false);
    setStep(session.result ? 'result' : session.sphere ? 'confirm' : 'sphere');
    nextScreen();
  }

  function removeFromHistory(id) {
    updateSession(id, { inRecent: false });
    if (id === currentId) startNew();
  }

  /* ---------- Ошибки и тариф ---------- */
  function retryAfterMistake() {
    updateSession(current.id, { inRecent: false });
    startNew(current.brand);
  }

  function renewPlan() {
    setGenerations(0);
    setAlert(null);
    notify(`Подписка продлена: доступно ${FREE_LIMIT} генерации`);
  }

  /* ---------- Отправка поля ввода ---------- */
  function submitInput() {
    if (step === 'loading') {
      stopGeneration();
      return;
    }
    const text = input.trim();
    if (!text) {
      focusInput();
      return;
    }
    setInput('');
    setAlert(null);
    if (step === 'brand') submitBrand(text);
    else if (step === 'sphere') chooseSphere(capitalize(text), picker.path[0]?.id || findGroup(text));
    else submitBrand(text, { asNewRequest: true }); // на остальных экранах текст начинает новый запрос
  }

  return {
    sessions, current, currentId, step, picker, input, alert, showTips, fresh, screenKey, focusKey,
    setInput, startNew, submitInput,
    openSphere, goBack, goToDepth, selectSphere, applySphere, editSphere,
    startGeneration, regenerate, stopGeneration,
    toggleLike, saveFeedback, openSession, removeFromHistory, retryAfterMistake, renewPlan
  };
}
