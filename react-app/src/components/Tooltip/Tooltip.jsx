import styles from './Tooltip.module.css';
import { Icon } from '../Icon/Icon.jsx';
import { cx } from '../../lib/cx.js';

/* Тёмная подсказка с хвостиком. placement задаёт позицию, tail — сторону хвостика */
export function Tooltip({ children, onClose, placement = 'below', tail = 'left', delay = 0, className }) {
  return (
    <div
      className={cx(styles.tooltip, styles[placement], styles[`tail-${tail}`], className)}
      role={onClose ? 'note' : 'tooltip'}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span>{children}</span>
      {onClose && (
        <button className={styles.close} type="button" aria-label="Закрыть подсказку" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      )}
    </div>
  );
}
