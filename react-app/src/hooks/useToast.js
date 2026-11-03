import { useCallback, useEffect, useRef, useState } from 'react';

/* Короткое уведомление внизу экрана, которое само скрывается */
export function useToast(duration = 2400) {
  const [toast, setToast] = useState({ text: '', visible: false });
  const timer = useRef(null);

  const showToast = useCallback(text => {
    setToast({ text, visible: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(current => ({ ...current, visible: false })), duration);
  }, [duration]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return [toast, showToast];
}
