import { useCallback, useEffect, useRef, useState } from 'react';
import { isRecognitionSupported, startListening, stopListening, UNSUPPORTED_RECOGNITION } from '../lib/speech.js';

/* Голосовой ввод (Web Speech API, SpeechRecognition) */
export function useSpeechRecognition({ onInterim, onFinal, onError }) {
  const [listening, setListening] = useState(false);
  const handlers = useRef({ onInterim, onFinal, onError });

  useEffect(() => {
    handlers.current = { onInterim, onFinal, onError };
  }, [onInterim, onFinal, onError]);

  const start = useCallback(() => {
    startListening({
      lang: 'ru-RU',
      onStart: () => setListening(true),
      onInterim: text => handlers.current.onInterim?.(text),
      onFinal: text => handlers.current.onFinal?.(text),
      onError: message => handlers.current.onError?.(message),
      onEnd: () => setListening(false)
    });
  }, []);

  const stop = useCallback(() => stopListening(), []);

  // запись останавливается, если компонент исчезает со страницы
  useEffect(() => () => stopListening(), []);

  return { supported: isRecognitionSupported(), unsupportedMessage: UNSUPPORTED_RECOGNITION, listening, start, stop };
}
