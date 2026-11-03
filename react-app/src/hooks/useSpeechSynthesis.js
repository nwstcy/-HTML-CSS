import { useCallback, useEffect, useRef, useState } from 'react';
import { isSynthesisSupported, speak, stopSpeaking, UNSUPPORTED_SYNTHESIS } from '../lib/speech.js';

/* Озвучка китайского названия (Web Speech API, speechSynthesis) */
export function useSpeechSynthesis({ onError }) {
  const [speakingText, setSpeakingText] = useState(null);
  const speakingRef = useRef(null);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    speakingRef.current = speakingText;
  }, [speakingText]);

  const stop = useCallback(() => {
    stopSpeaking();
    setSpeakingText(null);
  }, []);

  /* Нажатие на ту же кнопку останавливает звук, на другую — переключает */
  const toggle = useCallback(text => {
    if (!isSynthesisSupported()) {
      onErrorRef.current?.(UNSUPPORTED_SYNTHESIS);
      return;
    }
    const wasSpeaking = speakingRef.current === text;
    stopSpeaking();
    setSpeakingText(null);
    if (wasSpeaking) return;

    speak(text, {
      onStart: () => setSpeakingText(text),
      onEnd: () => setSpeakingText(current => (current === text ? null : current)),
      onError: message => onErrorRef.current?.(message)
    });
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  return { supported: isSynthesisSupported(), speakingText, toggle, stop };
}
