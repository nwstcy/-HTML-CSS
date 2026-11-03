import styles from './SpherePicker.module.css';
import { Icon } from '../Icon/Icon.jsx';
import { Button } from '../Button/Button.jsx';
import { cx } from '../../lib/cx.js';
import { levelAt } from '../../lib/spheres.js';

/* Выбор сферы: три уровня категорий, «хлебные крошки», «Назад», выбор конечной сферы */
export function SpherePicker({ picker, onOpen, onBack, onDepth, onSelect }) {
  const { path, selected, direction } = picker;
  const items = levelAt(path);
  const isLeaf = typeof items[0] === 'string';
  const crumbs = ['Все сферы', ...path.map(node => node.name)];
  const levelKey = crumbs.join('/'); // новый ключ → сетка появляется с анимацией сдвига

  return (
    <div className={styles.picker}>
      <div className={styles.head}>
        <ol className={styles.crumbs} aria-label="Путь по сферам">
          {crumbs.map((name, depth) => (
            <li key={name + depth} className={styles.crumb}>
              {depth > 0 && <Icon name="chevron-right" size={16} className={styles.crumbIcon} />}
              {depth < crumbs.length - 1
                ? <button className={styles.crumbLink} type="button" onClick={() => onDepth(depth)}>{name}</button>
                : <span aria-current="location">{name}</span>}
            </li>
          ))}
        </ol>
        <h3 className={styles.title}>Выберите сферу</h3>
      </div>

      {path.length > 0 && (
        <Button variant="back" className={styles.back} onClick={onBack}>
          <Icon name="back" size={16} />Назад
        </Button>
      )}

      <ul
        key={levelKey}
        className={cx(styles.grid, direction === 'back' ? styles.gridBack : styles.gridForward)}
        style={{ '--rows': Math.ceil(items.length / 3) }}
        role={isLeaf ? 'listbox' : 'list'}
        aria-label="Сферы"
      >
        {items.map((item, i) => (isLeaf
          ? (
            <li key={item} role="none">
              <button
                className={cx(styles.chip, selected === item && styles.selected)}
                type="button"
                role="option"
                aria-selected={selected === item}
                style={{ animationDelay: `${i * 22}ms` }}
                onClick={() => onSelect(item)}
              >
                {item}
              </button>
            </li>
          )
          : (
            <li key={item.id}>
              <button className={styles.chip} type="button" style={{ animationDelay: `${i * 22}ms` }} onClick={() => onOpen(item)}>
                <span>{item.name}</span>
                <Icon name="chevron-down" size={24} className={styles.chipIcon} />
              </button>
            </li>
          )))}
      </ul>
    </div>
  );
}
