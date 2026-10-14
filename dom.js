/* Ссылки на элементы страницы и помощники для создания DOM и анимаций. */

export const $ = sel => document.querySelector(sel);

export const el = {
  dialog: $('#dialog'),
  scroll: $('#chat-scroll'),
  composer: $('#composer'),
  input: $('#composer-input'),
  send: $('#composer-send'),
  alerts: $('#alert-slot'),
  applyBar: $('#apply-bar'),
  apply: $('#apply-sphere'),
  recent: $('#recent'),
  recentList: $('#recent-list'),
  favorites: $('#favorites'),
  favoritesList: $('#favorites-list'),
  history: $('.history'),
  sidebar: $('#sidebar'),
  backdrop: $('#sidebar-backdrop'),
  menuOpen: $('#menu-open'),
  modal: $('#modal'),
  toast: $('#toast'),
  newRequestWrap: $('.new-request-wrap')
};

/* Экранирование пользовательского текста перед вставкой в HTML */
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const icon = (id, size = 20, extra = '') =>
  `<svg class="icon icon--${size} ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

/* Текст, который «печатается» по словам */
export const words = (text, delay = 0) => esc(text).split(/(\s+)/)
  .map((w, i) => (/^\s+$/.test(w) ? w : `<span class="word" style="--i:${i >> 1};--d:${delay}ms">${w}</span>`))
  .join('');

/* Иероглифы, которые проявляются по одному */
export const hanzi = (text, delay = 0) => [...text]
  .map((ch, i) => `<span class="hanzi-char" style="--i:${i};--d:${delay}ms">${esc(ch)}</span>`)
  .join('');

/* Добавляет сообщение в диалог и возвращает созданный элемент */
export function appendMessage(className, html, role) {
  const node = document.createElement('li');
  node.className = `message ${className}`;
  if (role) node.dataset.role = role;
  node.innerHTML = html;
  el.dialog.append(node);
  return node;
}

export function scrollToNode(node) {
  requestAnimationFrame(() => el.scroll.scrollTo({ top: Math.max(0, node.offsetTop - 24), behavior: 'smooth' }));
}

export function scrollToEnd() {
  requestAnimationFrame(() => el.scroll.scrollTo({ top: el.scroll.scrollHeight, behavior: 'smooth' }));
}

/* Смена экрана с анимацией (View Transitions API, если браузер поддерживает) */
export function transition(update) {
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

/* Удаляет элемент после анимации исчезновения */
export function removeAnimated(node, cls = 'message--leaving') {
  if (!node) return Promise.resolve();
  return new Promise(resolve => {
    let finished = false;
    const done = () => { if (finished) return; finished = true; node.remove(); resolve(); };
    node.classList.add(cls);
    node.addEventListener('animationend', done, { once: true });
    setTimeout(done, 450);
  });
}
