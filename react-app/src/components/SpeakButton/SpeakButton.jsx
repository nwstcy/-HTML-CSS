import styles from './SpeakButton.module.css';
import { Icon } from '../Icon/Icon.jsx';
import { cx } from '../../lib/cx.js';

/* «Послушать произношение» — синтез речи (Web Speech API) */
export function SpeakButton({ text, speaking, supported, delay = 0, onToggle }) {
  const label = supported
    ? (speaking ? `Остановить произношение ${text}` : `Послушать произношение ${text}`)
    : 'Озвучка не поддерживается в этом браузере';
  return (
    <button
      type="button"
      className={cx(styles.button, speaking && styles.active, !supported && styles.unavailable)}
      aria-label={label}
      title={label}
      aria-pressed={speaking}
      aria-disabled={!supported || undefined}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onToggle(text)}
    >
      <Icon name="volume" size={24} className={styles.icon} />
      <span className={styles.wave} aria-hidden="true" />
    </button>
  );
}
