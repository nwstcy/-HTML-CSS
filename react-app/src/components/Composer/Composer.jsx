import { useEffect, useRef, useState } from 'react';
import styles from './Composer.module.css';
import { Icon } from '../Icon/Icon.jsx';
import { Tooltip } from '../Tooltip/Tooltip.jsx';
import { cx } from '../../lib/cx.js';

/* Поле ввода внизу экрана: текст, голосовой ввод, отправка / остановка генерации */
export function Composer({ value, placeholder, busy, focusKey, voice, onChange, onSubmit }) {
  const inputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const ready = value.trim().length > 0 && !busy;

  // фокус на поле, когда сценарий этого просит (новый запрос, повтор)
  useEffect(() => {
    if (focusKey > 0) inputRef.current?.focus({ preventScroll: true });
  }, [focusKey]);

  const handleSubmit = event => {
    event.preventDefault();
    if (voice.listening) voice.stop();
    onSubmit();
  };

  return (
    <form
      className={cx(styles.composer, ready && styles.ready, busy && styles.busy, voice.listening && styles.listening)}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <label className={styles.visuallyHidden} htmlFor="composer-input">Сообщение</label>
      <input
        ref={inputRef}
        id="composer-input"
        className={styles.input}
        type="text"
        maxLength={60}
        value={value}
        placeholder={voice.listening ? 'Говорите…' : placeholder}
        disabled={busy}
        onChange={event => onChange(event.target.value)}
      />

      <button
        type="button"
        className={cx(styles.mic, !voice.supported && styles.micUnavailable)}
        aria-label={voice.listening ? 'Остановить запись' : 'Сказать голосом'}
        title={voice.supported ? 'Сказать голосом' : voice.unsupportedMessage}
        aria-pressed={voice.listening}
        aria-disabled={!voice.supported || undefined}
        disabled={busy}
        onClick={voice.toggle}
      >
        <Icon name="mic" size={24} />
      </button>

      <button
        type="submit"
        className={styles.send}
        aria-label={busy ? 'Остановить генерацию' : 'Отправить'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <Icon name="arrow-up" size={24} className={styles.arrow} />
        <span className={styles.stop} aria-hidden="true" />
      </button>

      {busy && hovered && (
        <Tooltip placement="above" tail="right" className={styles.stopTip}>Остановить генерацию</Tooltip>
      )}
    </form>
  );
}
