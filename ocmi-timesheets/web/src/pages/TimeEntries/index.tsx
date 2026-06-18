import { useTranslation } from 'react-i18next';
import styles from './TimeEntries.module.css';

export function TimeEntriesPage() {
  const { t } = useTranslation();
  return (
    <div className={styles.placeholder}>
      <p>{t('placeholders.timeEntries')}</p>
    </div>
  );
}
