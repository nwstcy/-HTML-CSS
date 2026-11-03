import { SPHERES } from '../data/data.js';

/* Уровень дерева сфер по пути из выбранных категорий */
export function levelAt(path) {
  let items = SPHERES;
  for (const node of path) items = node.children;
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

export const sessionLabel = s => (s.sphere ? `${s.brand}, ${s.sphere}` : s.brand);
