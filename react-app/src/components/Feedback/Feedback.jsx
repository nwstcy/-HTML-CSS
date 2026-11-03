import styles from './Feedback.module.css';
import { useFeedback } from '../../hooks/useFeedback.js';
import { cx } from '../../lib/cx.js';

const OPTIONS = [
  { rating: 'fits', label: 'Подходит' },
  { rating: 'misses', label: 'Не подходит' }
];

/* Отзыв о названии — отправляется POST-запросом, ответ сервера показывается на странице */
export function Feedback({ session, onSaved }) {
  const { status, rating, id, error, send } = useFeedback({ saved: session.feedback, onSaved });
  const { adaptation } = session.result;

  const choose = value => send({
    brand: session.brand,
    sphere: session.sphere,
    hanzi: adaptation.hanzi,
    pinyin: adaptation.pinyin,
    rating: value
  });

  return (
    <section className={styles.feedback} aria-label="Отзыв о названии">
      <p className={styles.question}>Подходит ли название «{adaptation.hanzi}»?</p>

      <div className={styles.options}>
        {OPTIONS.map(option => (
          <button
            key={option.rating}
            type="button"
            className={cx(styles.option, rating === option.rating && styles.chosen)}
            aria-pressed={rating === option.rating}
            disabled={status === 'sending' || status === 'success'}
            onClick={() => choose(option.rating)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className={cx(styles.status, status === 'error' && styles.error)} role="status">
        {status === 'sending' && 'Отправляем отзыв на сервер…'}
        {status === 'success' && `Спасибо! Сервер принял отзыв №${id}.`}
        {status === 'error' && (
          <>
            {error}{' '}
            <button className={styles.retry} type="button" onClick={() => choose(rating)}>Отправить ещё раз</button>
          </>
        )}
      </p>
    </section>
  );
}
