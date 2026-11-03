/* GET: перевод на китайский через MyMemory Translation API
   https://mymemory.translated.net/doc/spec.php — без ключа, CORS разрешён */
import { request, ApiError } from './client.js';

const ENDPOINT = 'https://api.mymemory.translated.net/get';
const cache = new Map(); // одинаковые сферы не запрашиваем повторно

export async function translateToChinese(text, { signal } = {}) {
  const key = text.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);

  const params = new URLSearchParams({ q: text.trim(), langpair: 'ru|zh-CN' });
  const data = await request(`${ENDPOINT}?${params}`, { signal });

  const translated = data?.responseData?.translatedText?.trim();
  if (Number(data?.responseStatus) !== 200 || !translated) {
    throw new ApiError(data?.responseDetails || 'Сервис перевода не вернул результат.');
  }
  if (/MYMEMORY WARNING/i.test(translated)) {
    throw new ApiError('Бесплатный лимит переводов на сегодня исчерпан.');
  }

  cache.set(key, translated);
  return translated;
}
