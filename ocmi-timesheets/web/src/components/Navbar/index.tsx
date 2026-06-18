import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Tab } from '../../types/tab';
import { useTheme } from '../../context/ThemeContext';
import { CloseIcon } from '../Icons';
import styles from './Navbar.module.css';

interface NavbarProps {
  activeTab:   Tab;
  onTabChange: (tab: Tab) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'employees',      label: t('nav.employees')     },
    { id: 'time-entries',   label: t('nav.timeEntries')   },
    { id: 'weekly-summary', label: t('nav.weeklySummary') },
  ];

  function selectTab(tab: Tab) {
    onTabChange(tab);
    setOpen(false);
  }

  // Language flag: show the flag of the OTHER language (= what you switch to)
  const langIcon = i18n.language === 'en' ? '🇨🇴' : '🇺🇸';
  const themeIcon = theme === 'light' ? '🌙' : '☀️';

  return (
    <>
      {/* ── Desktop nav (≥ 1024 px) ─────────────────────────────── */}
      <nav className={styles.desktopNav} aria-label="Main navigation">
        <div className={styles.navInner}>
          <span className={styles.brand}>OCMI Timesheets</span>

          <div className={styles.tabs} role="tablist">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                onClick={() => onTabChange(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <button
              className={styles.controlBtn}
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
              aria-label="Switch language"
            >
              {langIcon}
            </button>
            <button
              className={styles.controlBtn}
              onClick={toggle}
              aria-label={themeIcon === '🌙' ? t('common.theme.dark') : t('common.theme.light')}
            >
              {themeIcon}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile bar (< 1024 px) — collapsed ──────────────────── */}
      <div className={styles.mobileBar}>
        <button
          className={styles.mobileTitle}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Open navigation menu"
        >
          OCMI TimeSheet
        </button>
      </div>

      {/* ── Mobile overlay — expanded ────────────────────────────── */}
      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Close */}
          <button
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>

          {/* Tab links */}
          <nav className={styles.menuLinks}>
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                className={`${styles.menuLink} ${activeTab === id ? styles.menuLinkActive : ''}`}
                onClick={() => selectTab(id)}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Settings: language then theme, vertical */}
          <div className={styles.settings}>
            <button
              className={styles.controlBtn}
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
              aria-label="Switch language"
            >
              {langIcon}
            </button>
            <button
              className={styles.controlBtn}
              onClick={toggle}
              aria-label={themeIcon === '🌙' ? t('common.theme.dark') : t('common.theme.light')}
            >
              {themeIcon}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
