import styles from './Toast.module.css';
import { cx } from '../../lib/cx.js';

/* Короткое уведомление внизу экрана */
export function Toast({ text, visible }) {
  return (
    <div className={cx(styles.toast, visible && styles.visible)} role="status" aria-live="polite">
      {text}
    </div>
  );
}
