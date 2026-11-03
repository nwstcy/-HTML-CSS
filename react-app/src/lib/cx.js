/* Склеивает имена классов, пропуская пустые значения: cx(a, flag && b) */
export const cx = (...names) => names.filter(Boolean).join(' ');
