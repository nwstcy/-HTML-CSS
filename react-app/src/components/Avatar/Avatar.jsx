import { useId } from 'react';
import styles from './Avatar.module.css';

/* Аватар пользователя из макета: серый круг с силуэтом (некликабельный) */
export function Avatar() {
  const id = `avatar${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`; // id без спецсимволов для url(#…)
  return (
    <span className={styles.avatar} aria-hidden="true">
      <svg className={styles.image} viewBox="0 0 32 32">
        <defs>
          <radialGradient id={`${id}-glow`} cx=".5" cy=".75" r=".5">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-clip`}><circle cx="16" cy="16" r="16" /></clipPath>
        </defs>
        <g clipPath={`url(#${id}-clip)`}>
          <circle className={styles.background} cx="16" cy="16" r="16" />
          <ellipse cx="16" cy="30.4" rx="12.8" ry="9.6" fill={`url(#${id}-glow)`} />
          <circle cx="16" cy="12.8" r="6.4" fill={`url(#${id}-glow)`} />
        </g>
      </svg>
    </span>
  );
}
