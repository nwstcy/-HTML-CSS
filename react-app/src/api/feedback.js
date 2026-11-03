/* POST: отзыв о подобранном названии через JSONPlaceholder
   https://jsonplaceholder.typicode.com — учебный REST API: принимает данные
   и возвращает созданную запись с id, но на самом деле ничего не хранит. */
import { request } from './client.js';

const ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

/**
 * sendFeedback({ brand, sphere, hanzi, pinyin, rating }) → { id, ... }
 * rating: 'fits' — название подходит, 'misses' — не подходит
 */
export function sendFeedback({ brand, sphere, hanzi, pinyin, rating }) {
  return request(ENDPOINT, {
    method: 'POST',
    body: {
      userId: 1,
      title: `${brand} → ${hanzi}`,
      body: rating === 'fits' ? 'Название подходит' : 'Название не подходит',
      brand,
      sphere,
      hanzi,
      pinyin,
      rating,
      createdAt: new Date().toISOString()
    }
  });
}
