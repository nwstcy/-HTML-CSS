import { useState } from 'react';
import styles from './Result.module.css';
import { Words } from '../AnimatedText/AnimatedText.jsx';
import { Variant } from '../Variant/Variant.jsx';
import { Tools } from '../Message/Message.jsx';
import { ToolButton } from '../ToolButton/ToolButton.jsx';
import { Icon } from '../Icon/Icon.jsx';
import { Tooltip } from '../Tooltip/Tooltip.jsx';
import { SphereTranslation } from '../SphereTranslation/SphereTranslation.jsx';
import { Feedback } from '../Feedback/Feedback.jsx';
import { cx } from '../../lib/cx.js';

/* Результат: адаптация с учётом сферы и вариант по звучанию */
export function Result({ session, speech, onLike, onCopy, onRegenerate, onFeedback, showTip, onTipClose }) {
  const { adaptation, sound } = session.result;
  const [spinning, setSpinning] = useState(false);

  const regenerate = () => {
    setSpinning(true);
    onRegenerate();
  };

  return (
    <article className={styles.result}>
      <h2 className={styles.title}><Words text={`Адаптация для ${session.brand}, ${session.sphere}`} /></h2>
      <SphereTranslation sphere={session.sphere} />
      <div className={styles.variants}>
        <Variant label="Адаптация с учётом сферы" data={adaptation} delay={200} speech={speech} />
        <Variant label="Вариант по звучанию" data={sound} delay={900} speech={speech}>
          <div className={styles.actions}>
          <Tools className={styles.tools}>
            <ToolButton
              key={String(session.liked)} // смена ключа перезапускает анимацию сердечка
              label={session.liked ? 'Убрать из «Моих брендов»' : 'Сохранить в «Мои бренды»'}
              aria-pressed={session.liked}
              className={cx(styles.like, session.liked && styles.liked)}
              onClick={onLike}
            >
              <Icon name={session.liked ? 'heart-fill' : 'heart'} size={20} />
            </ToolButton>
            <ToolButton label="Скопировать результат" className={styles.tool} onClick={onCopy}>
              <Icon name="copy" size={20} />
            </ToolButton>
            <ToolButton label="Сгенерировать другой вариант" className={cx(styles.tool, spinning && styles.spin)} onClick={regenerate}>
              <Icon name="loop" size={20} />
            </ToolButton>
          </Tools>
          {showTip && (
            <Tooltip className={styles.tip} onClose={onTipClose} delay={1900}>
              Можете сохранить результат. Он появится слева в поле «Мои бренды»
            </Tooltip>
          )}
          {/* key: новый вариант названия — новый отзыв */}
          <Feedback key={`${session.id}-${session.seed}`} session={session} onSaved={feedback => onFeedback(session.id, feedback)} />
          </div>
        </Variant>
      </div>
    </article>
  );
}
