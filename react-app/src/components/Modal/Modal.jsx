import { useState } from 'react';
import styles from './Modal.module.css';
import { Button } from '../Button/Button.jsx';
import { cx } from '../../lib/cx.js';

const CLOSE_DURATION = 180;

/* Модальное окно подтверждения. Закрывается кнопкой, кликом по фону или Esc */
export function Modal({ title, text, confirmLabel, danger = false, onConfirm, onClose }) {
  const [closing, setClosing] = useState(false);

  const close = after => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      after?.();
    }, CLOSE_DURATION);
  };

  return (
    <div
      className={cx(styles.modal, closing && styles.closing)}
      onKeyDown={event => event.key === 'Escape' && close()}
    >
      <div className={styles.backdrop} onClick={() => close()} aria-hidden="true" />
      <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-text">
        <h2 className={styles.title} id="modal-title">{title}</h2>
        <p className={styles.text} id="modal-text">{text}</p>
        <div className={styles.actions}>
          <Button variant="soft" onClick={() => close()}>Отменить</Button>
          <Button variant={danger ? 'danger' : 'primary'} autoFocus onClick={() => close(onConfirm)}>{confirmLabel}</Button>
        </div>
      </section>
    </div>
  );
}
