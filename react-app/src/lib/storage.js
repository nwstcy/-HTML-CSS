/* Web Storage API (localStorage): «Недавние» и «Мои бренды» сохраняются между визитами.
   Если хранилище недоступно (приватный режим, запрет cookies, переполнение),
   приложение продолжает работать — история просто живёт до перезагрузки страницы. */

const KEY = 'cb-history-v1';
const MAX_ITEMS = 50;

function isValidSession(item) {
  return item && typeof item === 'object' && Number.isInteger(item.id) && typeof item.brand === 'string' && item.brand.length > 0;
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isValidSession) : [];
  } catch {
    return []; // повреждённые данные или запрет доступа — начинаем с пустой истории
  }
}

/* Возвращает false, если сохранить не удалось */
export function saveHistory(sessions) {
  const data = sessions
    .filter(s => s.brand && (s.inRecent || (s.liked && s.result)))
    .slice(0, MAX_ITEMS)
    .map(({ id, brand, sphere, sphereGroup, result, seed, liked, inRecent, feedback }) => ({ id, brand, sphere, sphereGroup, result, seed, liked, inRecent, feedback }));
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/* Подсказки онбординга, которые пользователь уже закрыл */
const TIPS_KEY = 'cb-seen-tips';

export function loadSeenTips() {
  try {
    const data = JSON.parse(localStorage.getItem(TIPS_KEY) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export function saveSeenTips(seen) {
  try {
    localStorage.setItem(TIPS_KEY, JSON.stringify(seen));
  } catch {
    /* приватный режим: подсказки покажутся снова после перезагрузки */
  }
}
