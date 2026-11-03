import styles from './Variant.module.css';
import { Words, Hanzi } from '../AnimatedText/AnimatedText.jsx';
import { SpeakButton } from '../SpeakButton/SpeakButton.jsx';

/* Один вариант названия: иероглифы, озвучка, пиньинь и объяснение */
export function Variant({ label, data, delay, speech, children }) {
  return (
    <section className={styles.variant}>
      <h3 className={styles.label}>{label}</h3>
      <div className={styles.body}>
        <div className={styles.hanziRow}>
          <p className={styles.hanzi} lang="zh-Hans" aria-label={data.hanzi}><Hanzi text={data.hanzi} delay={delay} /></p>
          <SpeakButton
            text={data.hanzi}
            speaking={speech.speakingText === data.hanzi}
            supported={speech.supported}
            delay={delay + 300}
            onToggle={speech.toggle}
          />
        </div>
        <div className={styles.texts}>
          <p className={styles.pinyin}><Words text={data.pinyin} delay={delay + 250} /></p>
          <p className={styles.meaning}><Words text={data.text} delay={delay + 350} /></p>
        </div>
        {children}
      </div>
    </section>
  );
}
