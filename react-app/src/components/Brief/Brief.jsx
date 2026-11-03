import styles from './Brief.module.css';
import { Words } from '../AnimatedText/AnimatedText.jsx';
import { Question } from '../Message/Message.jsx';
import { Button } from '../Button/Button.jsx';
import { Tooltip } from '../Tooltip/Tooltip.jsx';

/* Проверка данных перед генерацией: «Бренд: … Сфера: …» и кнопка «Адаптировать бренд» */
export function Brief({ brand, sphere, onGenerate, showTip, onTipClose }) {
  return (
    <div className={styles.brief}>
      <Question as="p"><Words text={`Бренд: ${brand}\nСфера: ${sphere}`} delay={150} /></Question>
      <Button variant="primary" onClick={onGenerate}>Адаптировать бренд</Button>
      {showTip && (
        <Tooltip className={styles.tip} onClose={onTipClose} delay={900}>Нажмите, если данные верны</Tooltip>
      )}
    </div>
  );
}
