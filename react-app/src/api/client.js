/* Общий HTTP-клиент на fetch: JSON, таймаут, понятные сообщения об ошибках */

export class ApiError extends Error {
  constructor(message, { status = 0, aborted = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.aborted = aborted; // запрос отменили сами (компонент исчез) — показывать не нужно
  }
}

const DEFAULT_TIMEOUT = 8000;

/**
 * request(url, { method, body, signal, timeout }) → Promise<данные из JSON>
 * body передаётся объектом и отправляется как JSON.
 */
export async function request(url, { method = 'GET', body, signal, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);
  const abortFromOutside = () => controller.abort();
  signal?.addEventListener('abort', abortFromOutside, { once: true });

  try {
    const response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json; charset=UTF-8' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new ApiError(`Сервер ответил ошибкой ${response.status}. Попробуйте позже.`, { status: response.status });
    }

    try {
      return await response.json();
    } catch {
      throw new ApiError('Сервер вернул данные в неожиданном формате.', { status: response.status });
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      if (timedOut) throw new ApiError('Сервер долго не отвечает. Попробуйте ещё раз.');
      throw new ApiError('Запрос отменён', { aborted: true });
    }
    throw new ApiError('Нет связи с сервером. Проверьте подключение к интернету.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abortFromOutside);
  }
}
