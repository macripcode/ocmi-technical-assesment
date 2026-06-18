import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();

  const label = theme === 'light' ? t('common.theme.dark') : t('common.theme.light');
  const icon  = theme === 'light' ? '🌙' : '☀️';

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      title={label}
      aria-label={label}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
