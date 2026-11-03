import { useCallback, useEffect, useState } from 'react';
import { loadSeenTips, saveSeenTips } from '../lib/storage.js';

/* Подсказки онбординга: закрытые запоминаются в localStorage */
export function useSeenTips() {
  const [seen, setSeen] = useState(loadSeenTips);

  const dismissTip = useCallback(key => {
    setSeen(current => (current[key] ? current : { ...current, [key]: true }));
  }, []);

  useEffect(() => saveSeenTips(seen), [seen]);

  return [seen, dismissTip];
}
