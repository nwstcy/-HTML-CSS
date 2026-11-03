import styles from './Message.module.css';
import { cx } from '../../lib/cx.js';

/* Сообщение в диалоге. from: assistant | user. raised — поверх соседей (для подсказок) */
export function Message({ from = 'assistant', raised = 0, delay = 0, ref, children }) {
  return (
    <li
      ref={ref}
      className={cx(styles.message, from === 'user' && styles.user)}
      style={{ zIndex: raised || undefined, animationDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </li>
  );
}

/* Вопрос нейросети: «Как называется ваш бренд?» */
export function Question({ as: Tag = 'h2', children }) {
  return <Tag className={styles.question}>{children}</Tag>;
}

/* Реплика пользователя в сером «пузыре» */
export function Bubble({ children }) {
  return <p className={styles.bubble}>{children}</p>;
}

/* Кнопки под репликой */
export function Tools({ className, children }) {
  return <div className={cx(styles.tools, className)}>{children}</div>;
}
