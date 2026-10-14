/* Боковая панель: списки «Недавние» и «Мои бренды» строятся из массива state.sessions. */
import { el, esc, icon } from './dom.js';
import { state, sessionLabel } from './state.js';

function historyItem(session, list, withDelete, shownKeys) {
  const key = `${list}-${session.id}`;
  const classes = ['history__item'];
  if (session === state.current && list === 'recent') classes.push('history__item--active');
  if (shownKeys.has(key)) classes.push('history__item--static'); // уже был на экране — без анимации появления
  const label = esc(sessionLabel(session));

  const item = document.createElement('li');
  item.className = classes.join(' ');
  item.dataset.id = session.id;
  item.dataset.key = key;
  item.innerHTML = `<button class="history__link" type="button" data-open="${session.id}" title="${label}">${label}</button>
    ${withDelete ? `<button class="history__delete" type="button" data-delete="${session.id}" aria-label="Удалить «${label}» из истории">${icon('trash')}</button>` : ''}`;
  return item;
}

export function renderHistory() {
  const recent = state.sessions.filter(s => s.inRecent);
  const liked = state.sessions.filter(s => s.liked && s.result);
  const shownKeys = new Set([...el.recentList.children, ...el.favoritesList.children].map(n => n.dataset.key));

  el.recentList.replaceChildren(...recent.map(s => historyItem(s, 'recent', true, shownKeys)));
  el.favoritesList.replaceChildren(...liked.map(s => historyItem(s, 'fav', false, shownKeys)));

  el.recent.hidden = recent.length === 0;
  el.favorites.hidden = liked.length === 0;
  el.sidebar.classList.toggle('sidebar--empty', recent.length === 0 && liked.length === 0);
}
