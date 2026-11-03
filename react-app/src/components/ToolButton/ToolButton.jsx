import styles from './ToolButton.module.css';
import { cx } from '../../lib/cx.js';

/* Маленькая кнопка-иконка под сообщением: копировать, изменить, сохранить, повторить */
export function ToolButton({ label, className, children, ...props }) {
  return (
    <button type="button" className={cx(styles.toolButton, className)} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
