import styles from './Intro.module.css';
import { Words } from '../AnimatedText/AnimatedText.jsx';
import { Question } from '../Message/Message.jsx';
import { cx } from '../../lib/cx.js';

const STEPS = [
  'Вы называете бренд',
  'Выбираете сферу',
  'Я показываю результат: адаптацию под сферу и вариант по звучанию.'
];

/* Приветствие нейросети. После ввода бренда описание плавно сворачивается */
export function Intro({ collapsed, withAbout = true }) {
  return (
    <>
      {withAbout && (
        <div className={cx(styles.about, collapsed && styles.collapsed)}>
          <div className={styles.aboutInner}>
            <div className={styles.intro}>
              <div className={styles.block}>
                <p className={cx(styles.text, styles.lead)}>
                  <Words text="Привет! Я подберу китайское название для вашего бренда в три шага: с иероглифами, произношением и объяснением, почему оно подходит вашей сфере." />
                </p>
                <div className={styles.text}>
                  <p className={styles.text}><Words text="Как это будет:" delay={300} /></p>
                  <ol className={styles.steps}>
                    {STEPS.map((step, i) => <li key={step}><Words text={step} delay={380 + i * 60} /></li>)}
                  </ol>
                </div>
              </div>
              <p className={styles.text}><Words text="Понравившиеся названия можно сохранить в избранное." delay={700} /></p>
            </div>
          </div>
        </div>
      )}
      <Question as="h1"><Words text="Как называется ваш бренд?" delay={withAbout ? 900 : 0} /></Question>
    </>
  );
}
