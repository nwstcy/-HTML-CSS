import { useCallback, useEffect, useState } from 'react';
import { translateToChinese } from '../api/translation.js';

/* GET-запрос перевода сферы: состояние загрузки, результат, ошибка, повтор */
export function useSphereTranslation(sphere) {
  const [state, setState] = useState({ status: 'idle', text: '', error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!sphere) return undefined;
    const controller = new AbortController();
    setState({ status: 'loading', text: '', error: '' });

    translateToChinese(sphere, { signal: controller.signal })
      .then(text => setState({ status: 'success', text, error: '' }))
      .catch(error => {
        if (!error.aborted) setState({ status: 'error', text: '', error: error.message });
      });

    // ушли с экрана или сменилась сфера — старый запрос отменяется
    return () => controller.abort();
  }, [sphere, attempt]);

  const retry = useCallback(() => setAttempt(n => n + 1), []);

  return { ...state, retry };
}
