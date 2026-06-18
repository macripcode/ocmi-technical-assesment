import { useTranslation } from 'react-i18next';
import styles from './WeeklySummary.module.css';

export function WeeklySummaryPage() {
  const { t } = useTranslation();
  return (
    <div className={styles.placeholder}>
      <p>{t('placeholders.weeklySummary')}</p>
    </div>
  );
}
