import styles from './TopBar.module.css';
import { Icon } from '../Icon/Icon.jsx';

/* Верхняя панель на телефоне: меню, логотип, новый запрос */
export function TopBar({ menuOpen, onMenu, onNew }) {
  return (
    <header className={styles.topbar}>
      <button className={styles.iconButton} type="button" aria-label="Открыть меню" aria-expanded={menuOpen} onClick={onMenu}>
        <Icon name="menu" />
      </button>
      <span className={styles.logo}>CHINA BRAND</span>
      <button className={styles.newButton} type="button" aria-label="Новый запрос" onClick={onNew}>
        <Icon name="add" size={20} />
      </button>
    </header>
  );
}
