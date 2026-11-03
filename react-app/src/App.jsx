import { useCallback, useEffect, useState } from 'react';
import styles from './App.module.css';
import { Sidebar } from './components/Sidebar/Sidebar.jsx';
import { Chat } from './components/Chat/Chat.jsx';
import { Modal } from './components/Modal/Modal.jsx';
import { Toast } from './components/Toast/Toast.jsx';
import { useToast } from './hooks/useToast.js';
import { useSeenTips } from './hooks/useSeenTips.js';
import { useTranslator } from './hooks/useTranslator.js';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis.js';
import { useSpeechRecognition } from './hooks/useSpeechRecognition.js';
import { copyText } from './lib/clipboard.js';
import { FREE_LIMIT } from './data/data.js';

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

export default function App() {
  const [toast, showToast] = useToast();
  const [seenTips, dismissTip] = useSeenTips();
  const t = useTranslator({ notify: showToast, dismissTip });
  const speech = useSpeechSynthesis({ onError: showToast });

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null); // { title, text, confirmLabel, danger, onConfirm }

  /* ---------- Голосовой ввод: текст попадает в поле, пользователь отправляет сам ---------- */
  const { setInput } = t;
  const handleInterim = useCallback(text => setInput(text), [setInput]);
  const handleFinal = useCallback(text => setInput(capitalize(text)), [setInput]);
  const recognition = useSpeechRecognition({ onInterim: handleInterim, onFinal: handleFinal, onError: showToast });

  const voice = {
    supported: recognition.supported,
    unsupportedMessage: recognition.unsupportedMessage,
    listening: recognition.listening,
    stop: recognition.stop,
    toggle: () => {
      if (!recognition.supported) {
        showToast(recognition.unsupportedMessage);
        return;
      }
      if (recognition.listening) {
        recognition.stop();
        return;
      }
      speech.stop();
      recognition.start();
    }
  };

  /* смена экрана останавливает озвучку; генерация — запись */
  const { stop: stopSpeech } = speech;
  useEffect(() => stopSpeech(), [t.screenKey, stopSpeech]);

  const { stop: stopRecognition } = recognition;
  useEffect(() => {
    if (t.step === 'loading') stopRecognition();
  }, [t.step, stopRecognition]);

  /* ---------- Подсказки онбординга ---------- */
  const tips = {
    confirm: t.step === 'confirm' && t.showTips && !seenTips.confirm,
    edit: t.step === 'confirm' && t.showTips && !seenTips.edit,
    save: t.step === 'result' && t.showTips && !seenTips.save,
    closeConfirm: () => dismissTip('confirm'),
    closeEdit: () => dismissTip('edit'),
    closeSave: () => dismissTip('save')
  };
  const sidebarTip = t.step === 'result' && t.showTips && !seenTips.sidebar;

  /* ---------- Действия ---------- */
  const startNew = () => {
    dismissTip('sidebar');
    setMenuOpen(false);
    t.startNew();
  };

  const openSession = id => {
    setMenuOpen(false);
    t.openSession(id);
  };

  const askDelete = id => setModal({
    title: 'Хотите удалить?',
    text: 'Адаптация бренда будет удалена из истории. В «Моих брендах» она останется.',
    confirmLabel: 'Удалить',
    danger: true,
    onConfirm: () => t.removeFromHistory(id)
  });

  const showPlans = () => setModal({
    title: 'Тарифы China Brand',
    text: `Бесплатно — ${FREE_LIMIT} адаптации. Pro — без ограничений.`,
    confirmLabel: 'Подключить Pro',
    onConfirm: t.renewPlan
  });

  const copy = async text => showToast((await copyText(text)) ? 'Скопировано' : 'Не удалось скопировать');

  const copyRequest = () => copy(`${t.current.brand}, ${t.current.sphere}`);

  const copyResult = () => {
    const { brand, result } = t.current;
    copy(`${brand} → ${result.adaptation.hanzi} (${result.adaptation.pinyin}); по звучанию: ${result.sound.hanzi} (${result.sound.pinyin})`);
  };

  return (
    <div className={styles.app} onKeyDown={event => event.key === 'Escape' && setMenuOpen(false)}>
      <Sidebar
        sessions={t.sessions}
        activeId={t.currentId}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNew={startNew}
        onOpen={openSession}
        onDelete={askDelete}
        onPlans={showPlans}
        showTip={sidebarTip}
        onTipClose={() => dismissTip('sidebar')}
      />

      <Chat
        translator={t}
        tips={tips}
        speech={speech}
        voice={voice}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen(true)}
        onNew={startNew}
        onCopyRequest={copyRequest}
        onCopyResult={copyResult}
        onPlans={showPlans}
      />

      {modal && <Modal {...modal} onClose={() => setModal(null)} />}
      <Toast text={toast.text} visible={toast.visible} />
    </div>
  );
}
