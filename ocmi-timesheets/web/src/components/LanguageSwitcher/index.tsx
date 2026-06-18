import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          className={`${styles.option} ${i18n.language === code ? styles.active : ''}`}
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={i18n.language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
