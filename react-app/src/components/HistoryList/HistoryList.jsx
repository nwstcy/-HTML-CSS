import styles from './HistoryList.module.css';
import { Icon } from '../Icon/Icon.jsx';
import { cx } from '../../lib/cx.js';
import { sessionLabel } from '../../lib/spheres.js';

/* Группа истории: «Недавние» или «Мои бренды» */
export function HistoryList({ title, icon, items, activeId, onOpen, onDelete }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.group}>
      <h2 className={styles.title}>
        {icon && <Icon name={icon} size={20} className={styles.titleIcon} />}
        {title}
      </h2>
      <ul className={styles.list}>
        {items.map(session => {
          const label = sessionLabel(session);
          return (
            <li key={session.id} className={cx(styles.item, session.id === activeId && styles.active)}>
              <button className={styles.link} type="button" title={label} onClick={() => onOpen(session.id)}>
                {label}
              </button>
              {onDelete && (
                <button className={styles.delete} type="button" aria-label={`Удалить «${label}» из истории`} onClick={() => onDelete(session.id)}>
                  <Icon name="trash" size={20} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
