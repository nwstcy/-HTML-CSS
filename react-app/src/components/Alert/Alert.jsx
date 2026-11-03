import styles from './Alert.module.css';
import { Icon } from '../Icon/Icon.jsx';

/* Уведомления над полем ввода: ошибка обработки и исчерпанный лимит */
export function Alert({ kind, onRetry, onRenew, onPlans }) {
  if (kind === 'mistake') {
    return (
      <div className={styles.alert} role="alert">
        <Icon name="warning" size={20} className={styles.icon} />
        <p className={styles.text}>Название не удалось обработать, попробуйте снова</p>
        <span className={styles.retry}>
          <button className={styles.link} type="button" onClick={onRetry}>Обновить</button>
          <Icon name="loop" size={16} className={styles.retryIcon} />
        </span>
      </div>
    );
  }

  return (
    <div className={styles.limit} role="alert">
      <Icon name="warning" size={20} className={styles.limitIcon} />
      <div className={styles.content}>
        <div className={styles.texts}>
          <p className={styles.title}>Лимит генераций исчерпан</p>
          <p className={styles.text}>Вам необходимо продлить подписку</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.limitLinkUnderline} type="button" onClick={onRenew}>Обновить</button>
          <button className={styles.limitLink} type="button" onClick={onPlans}>Узнать о тарифах</button>
        </div>
      </div>
    </div>
  );
}
