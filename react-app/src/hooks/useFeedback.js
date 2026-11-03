import { useState } from 'react';
import { sendFeedback } from '../api/feedback.js';

/* POST-запрос отзыва: отправка, ответ сервера, ошибка */
export function useFeedback({ saved, onSaved }) {
  const [state, setState] = useState(
    saved ? { status: 'success', rating: saved.rating, id: saved.id, error: '' } : { status: 'idle', rating: null, id: null, error: '' }
  );

  async function send(payload) {
    setState({ status: 'sending', rating: payload.rating, id: null, error: '' });
    try {
      const response = await sendFeedback(payload);
      setState({ status: 'success', rating: payload.rating, id: response.id, error: '' });
      onSaved?.({ id: response.id, rating: payload.rating });
    } catch (error) {
      setState({ status: 'error', rating: payload.rating, id: null, error: error.message });
    }
  }

  return { ...state, send };
}
