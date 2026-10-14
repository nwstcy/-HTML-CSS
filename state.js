/* Состояние приложения: текущий шаг, история запросов, выбор сферы, показанные подсказки. */
import { SPHERES } from './data.js';

export const state = {
  sessions: [],                       // все запросы: «Недавние» и «Мои бренды»
  current: null,                      // запрос, открытый сейчас
  step: 'brand',                      // brand → sphere → confirm → loading → result | error
  picker: { path: [], selected: null }, // путь по дереву сфер и выбранная сфера
  generations: 0,                     // сколько генераций сделано (для лимита)
  busyTimer: null,
  seen: loadSeen(),                   // подсказки, которые пользователь уже закрыл
  modalAction: null
};

let uid = 0;

/* Новый запрос — обычный объект с данными */
export function createSession() {
  return { id: ++uid, brand: '', sphere: '', sphereGroup: null, result: null, seed: 0, liked: false, inRecent: false };
}

export function findSession(id) {
  return state.sessions.find(s => s.id === id);
}

export function removeSession(session) {
  state.sessions = state.sessions.filter(s => s !== session);
}

export const sessionLabel = s => (s.sphere ? `${s.brand}, ${s.sphere}` : s.brand);

function loadSeen() {
  try { return JSON.parse(localStorage.getItem('cb-seen-tips') || '{}'); } catch { return {}; }
}

export function markSeen(key) {
  state.seen[key] = true;
  try { localStorage.setItem('cb-seen-tips', JSON.stringify(state.seen)); } catch { /* приватный режим */ }
}

/* Уровень дерева сфер, на котором сейчас находится пользователь */
export function currentLevel() {
  let items = SPHERES;
  for (const node of state.picker.path) items = node.children;
  return items;
}

/* Сфера, введённая вручную: ищем её в справочнике, чтобы подобрать смысловой иероглиф */
export function findGroup(name) {
  const needle = name.toLowerCase();
  if (needle.length < 3) return null;
  for (const top of SPHERES) {
    const stack = [top];
    while (stack.length) {
      const item = stack.pop();
      const title = (typeof item === 'string' ? item : item.name).toLowerCase();
      if (title.includes(needle) || needle.includes(title)) return top.id;
      if (item.children) stack.push(...item.children);
    }
  }
  return null;
}
