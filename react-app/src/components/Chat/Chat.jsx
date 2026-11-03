import { useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { TopBar } from '../TopBar/TopBar.jsx';
import { Message, Question, Bubble, Tools } from '../Message/Message.jsx';
import { Intro } from '../Intro/Intro.jsx';
import { SpherePicker } from '../SpherePicker/SpherePicker.jsx';
import { Brief } from '../Brief/Brief.jsx';
import { Thinking } from '../Thinking/Thinking.jsx';
import { Result } from '../Result/Result.jsx';
import { Alert } from '../Alert/Alert.jsx';
import { Composer } from '../Composer/Composer.jsx';
import { Button } from '../Button/Button.jsx';
import { ToolButton } from '../ToolButton/ToolButton.jsx';
import { Tooltip } from '../Tooltip/Tooltip.jsx';
import { Icon } from '../Icon/Icon.jsx';
import { Words } from '../AnimatedText/AnimatedText.jsx';

const PLACEHOLDERS = {
  brand: 'Напишите название бренда, например: BMW',
  sphere: 'Или введите название сферы вручную'
};

/* Основная область: диалог с нейросетью и поле ввода */
export function Chat({ translator: t, tips, speech, voice, menuOpen, onMenu, onNew, onCopyRequest, onCopyResult, onPlans }) {
  const scrollRef = useRef(null);
  const sphereQuestionRef = useRef(null);
  const { step, current: session } = t;
  const flowStep = step === 'brand' || step === 'sphere' || step === 'confirm';

  // новый экран — прокрутка в начало
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [t.screenKey]);

  // на шаге сферы показываем вопрос, на шаге проверки — конец диалога
  // (с задержкой: сначала сворачивается приветствие и меняется высота диалога)
  useEffect(() => {
    if (step !== 'sphere' && step !== 'confirm') return undefined;
    const timer = setTimeout(() => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      const top = step === 'sphere' && sphereQuestionRef.current
        ? sphereQuestionRef.current.offsetTop - 24
        : scroller.scrollHeight;
      scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 450);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <main className={styles.chat}>
      <TopBar menuOpen={menuOpen} onMenu={onMenu} onNew={onNew} />

      <div className={styles.scroll} ref={scrollRef}>
        <div className={styles.column}>
          <ol className={styles.dialog} key={t.screenKey} aria-live="polite" aria-label="Диалог с China Brand">
            {flowStep && (
              <>
                <Message>
                  <Intro collapsed={step !== 'brand'} withAbout={t.fresh} />
                </Message>

                {session.brand && <Message from="user"><Bubble>{session.brand}</Bubble></Message>}

                {step !== 'brand' && (
                  <Message ref={sphereQuestionRef} delay={step === 'sphere' ? 300 : 0}>
                    <Question><Words text="В какой сфере работает бренд?" /></Question>
                    {step === 'sphere' && (
                      <SpherePicker
                        picker={t.picker}
                        onOpen={t.openSphere}
                        onBack={t.goBack}
                        onDepth={t.goToDepth}
                        onSelect={t.selectSphere}
                      />
                    )}
                  </Message>
                )}

                {step === 'confirm' && (
                  <>
                    <Message from="user" raised={tips.edit ? 6 : 0}>
                      <Bubble>{session.sphere}</Bubble>
                      <Tools>
                        <ToolButton label="Скопировать запрос" onClick={onCopyRequest}><Icon name="copy" size={16} /></ToolButton>
                        <ToolButton label="Изменить сферу" onClick={t.editSphere}><Icon name="pencil" size={16} /></ToolButton>
                        {tips.edit && (
                          <Tooltip className={styles.editTip} tail="right" delay={1300} onClose={tips.closeEdit}>
                            Можете отредактировать название бренда и сферу
                          </Tooltip>
                        )}
                      </Tools>
                    </Message>
                    <Message raised={tips.confirm ? 5 : 0}>
                      <Brief
                        brand={session.brand}
                        sphere={session.sphere}
                        onGenerate={t.startGeneration}
                        showTip={tips.confirm}
                        onTipClose={tips.closeConfirm}
                      />
                    </Message>
                  </>
                )}
              </>
            )}

            {step === 'loading' && <Message><Thinking /></Message>}

            {step === 'result' && session.result && (
              <Message raised={tips.save ? 5 : 0}>
                <Result
                  session={session}
                  speech={speech}
                  onLike={t.toggleLike}
                  onCopy={onCopyResult}
                  onRegenerate={t.regenerate}
                  onFeedback={t.saveFeedback}
                  showTip={tips.save}
                  onTipClose={tips.closeSave}
                />
              </Message>
            )}
          </ol>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.column}>
          {t.alert && <Alert kind={t.alert} onRetry={t.retryAfterMistake} onRenew={t.renewPlan} onPlans={onPlans} />}
          {step === 'sphere' && t.picker.selected && (
            <div className={styles.applyBar}>
              <Button variant="apply" onClick={t.applySphere}>Применить</Button>
            </div>
          )}
          <Composer
            value={t.input}
            placeholder={PLACEHOLDERS[step] ?? ''}
            busy={step === 'loading'}
            focusKey={t.focusKey}
            voice={voice}
            onChange={t.setInput}
            onSubmit={t.submitInput}
          />
        </div>
      </div>
    </main>
  );
}
