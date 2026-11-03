import styles from './Thinking.module.css';

/* Состояние генерации: переливающийся текст, как в ИИ-сервисах */
export function Thinking() {
  return <p className={styles.thinking} role="status">Подбираем адаптацию под сферу и звучание…</p>;
}
