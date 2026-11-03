import styles from './Sidebar.module.css';
import { Icon } from '../Icon/Icon.jsx';
import { Avatar } from '../Avatar/Avatar.jsx';
import { HistoryList } from '../HistoryList/HistoryList.jsx';
import { Tooltip } from '../Tooltip/Tooltip.jsx';
import { cx } from '../../lib/cx.js';

/* Боковая панель: логотип, «Новый запрос», история, тариф. На телефоне — выезжающее меню */
export function Sidebar({ sessions, activeId, open, onClose, onNew, onOpen, onDelete, onPlans, showTip, onTipClose }) {
  const recent = sessions.filter(s => s.inRecent);
  const favorites = sessions.filter(s => s.liked && s.result);
  const empty = recent.length === 0 && favorites.length === 0;

  return (
    <>
      <aside className={cx(styles.sidebar, empty && styles.empty, open && styles.open)} aria-label="Навигация">
        <div className={styles.top}>
          <div className={styles.head}>
            <button className={styles.logo} type="button" onClick={onNew}>CHINA BRAND</button>
            <button className={styles.close} type="button" aria-label="Закрыть меню" onClick={onClose}>
              <Icon name="close" />
            </button>
          </div>

          <div className={styles.nav}>
            <div className={styles.newRequestWrap}>
              <button className={styles.newRequest} type="button" onClick={onNew}>
                <span className={styles.newRequestIcon}><Icon name="add" size={20} /></span>
                <span>Новый запрос</span>
              </button>
              {showTip && (
                <Tooltip className={styles.tip} onClose={onTipClose} delay={2600}>
                  Нажмите «Новый запрос», чтобы адаптировать другой бренд
                </Tooltip>
              )}
            </div>

            <nav className={styles.history} aria-label="История запросов">
              <HistoryList title="Недавние" items={recent} activeId={activeId} onOpen={onOpen} onDelete={onDelete} />
              <HistoryList title="Мои бренды" icon="heart" items={favorites} onOpen={onOpen} />
            </nav>
          </div>
        </div>

        <footer className={styles.footer}>
          <Avatar />
          <button className={styles.plan} type="button" onClick={onPlans}>Сменить план</button>
        </footer>
      </aside>

      {open && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}
    </>
  );
}
