import styles from './Button.module.css';
import { cx } from '../../lib/cx.js';

/* Кнопка интерфейса. variant: primary | soft | danger | back | apply */
export function Button({ variant = 'soft', className, children, ...props }) {
  return (
    <button type="button" className={cx(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
