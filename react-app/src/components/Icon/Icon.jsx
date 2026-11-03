import { ICON_PATHS } from './paths.js';
import styles from './Icon.module.css';
import { cx } from '../../lib/cx.js';

/* Иконка из набора макета. size: 16 | 20 | 24 */
export function Icon({ name, size = 24, className }) {
  return (
    <svg className={cx(styles.icon, className)} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d={ICON_PATHS[name]} />
    </svg>
  );
}
