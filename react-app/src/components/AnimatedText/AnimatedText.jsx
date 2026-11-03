import styles from './AnimatedText.module.css';

/* Текст, который «печатается» по словам, как ответ нейросети */
export function Words({ text, delay = 0 }) {
  const parts = text.split(/(\s+)/);
  return parts.map((part, i) => (/^\s+$/.test(part)
    ? part
    : (
      <span key={i} className={styles.word} style={{ animationDelay: `${(i >> 1) * 26 + delay}ms` }}>
        {part}
      </span>
    )));
}

/* Иероглифы, которые проявляются по одному */
export function Hanzi({ text, delay = 0 }) {
  return [...text].map((char, i) => (
    <span key={i} className={styles.hanzi} style={{ animationDelay: `${i * 140 + delay}ms` }}>
      {char}
    </span>
  ));
}
