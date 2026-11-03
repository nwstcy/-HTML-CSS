import styles from './SphereTranslation.module.css';
import { useSphereTranslation } from '../../hooks/useSphereTranslation.js';

/* Как сфера бренда называется по-китайски — данные приходят GET-запросом с сервера */
export function SphereTranslation({ sphere }) {
  const { status, text, error, retry } = useSphereTranslation(sphere);

  return (
    <p className={styles.row} aria-live="polite">
      <span className={styles.label}>Сфера по-китайски:</span>
      {status === 'loading' && <span className={styles.loading}>загружаем перевод…</span>}
      {status === 'success' && <span className={styles.value} lang="zh-Hans">{text}</span>}
      {status === 'error' && (
        <span className={styles.error}>
          {error}{' '}
          <button className={styles.retry} type="button" onClick={retry}>Повторить</button>
        </span>
      )}
    </p>
  );
}
