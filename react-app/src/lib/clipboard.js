/* Clipboard API: копирование текста. Возвращает true, если получилось. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
