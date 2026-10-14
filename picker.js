/* Выбор сферы: дерево категорий из data.js, «хлебные крошки», «Назад», выбор конечной сферы. */
import { el, esc, icon } from './dom.js';
import { state, currentLevel } from './state.js';

export function renderPicker(container, direction = 'forward') {
  if (!container) return;
  const { path, selected } = state.picker;
  const items = currentLevel();
  const isLeaf = typeof items[0] === 'string';
  const crumbs = [{ name: 'Все сферы', depth: 0 }, ...path.map((p, i) => ({ name: p.name, depth: i + 1 }))];

  const crumbsHtml = crumbs.map((c, i) => `<li class="breadcrumbs__item">${i ? icon('chevron-right', 16) : ''}${i < crumbs.length - 1
    ? `<button class="breadcrumbs__link" type="button" data-depth="${c.depth}">${esc(c.name)}</button>`
    : `<span aria-current="location">${esc(c.name)}</span>`}</li>`).join('');

  const chipsHtml = items.map((item, i) => (isLeaf
    ? `<li role="none"><button class="sphere-chip${selected === item ? ' sphere-chip--selected' : ''}" type="button" role="option" aria-selected="${selected === item}" data-leaf="${esc(item)}" style="--i:${i}">${esc(item)}</button></li>`
    : `<li><button class="sphere-chip" type="button" data-node="${i}" style="--i:${i}"><span>${esc(item.name)}</span>${icon('chevron-down')}</button></li>`)).join('');

  container.innerHTML = `
    <div class="sphere-picker__head">
      <ol class="breadcrumbs" aria-label="Путь по сферам">${crumbsHtml}</ol>
      <h3 class="sphere-picker__title">Выберите сферу</h3>
    </div>
    ${path.length ? `<button class="button button--soft button--back sphere-picker__back" type="button" data-back>${icon('back', 16)}Назад</button>` : ''}
    <ul class="sphere-grid sphere-grid--${direction}" style="--rows:${Math.ceil(items.length / 3)}" role="${isLeaf ? 'listbox' : 'list'}" aria-label="Сферы">${chipsHtml}</ul>`;

  el.applyBar.hidden = !(state.step === 'sphere' && selected);
}

/* Клики внутри выбора сферы (делегирование событий) */
export function handlePickerClick(event) {
  const picker = event.target.closest('.sphere-picker');
  if (!picker || state.step !== 'sphere') return;

  const nodeButton = event.target.closest('[data-node]');
  const leafButton = event.target.closest('[data-leaf]');
  const crumb = event.target.closest('[data-depth]');
  const back = event.target.closest('[data-back]');

  if (nodeButton) {
    state.picker.path.push(currentLevel()[Number(nodeButton.dataset.node)]);
    state.picker.selected = null;
    renderPicker(picker, 'forward');
  } else if (leafButton) {
    state.picker.selected = leafButton.dataset.leaf;
    picker.querySelectorAll('[data-leaf]').forEach(button => {
      const on = button === leafButton;
      button.classList.toggle('sphere-chip--selected', on);
      button.setAttribute('aria-selected', on);
    });
    el.applyBar.hidden = false;
  } else if (crumb) {
    state.picker.path = state.picker.path.slice(0, Number(crumb.dataset.depth));
    state.picker.selected = null;
    renderPicker(picker, 'back');
  } else if (back) {
    state.picker.path.pop();
    state.picker.selected = null;
    renderPicker(picker, 'back');
  }
}
