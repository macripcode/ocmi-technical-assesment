import { useTranslation } from 'react-i18next';
import type { TimeEntry } from '../../types/timeEntry';
import { EditIcon, DeleteIcon } from '../Icons';
import styles from './TimeEntryList.module.css';

interface TimeEntryListProps {
  entries:          TimeEntry[];
  onEdit:           (entry: TimeEntry) => void;
  onDelete:         (entry: TimeEntry) => void;
  isInactive?:      boolean;
  onInactiveAction?: () => void;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     '2-digit',
  });
}

export function TimeEntryList({ entries, onEdit, onDelete, isInactive = false, onInactiveAction }: TimeEntryListProps) {
  const { t } = useTranslation();

  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t('timeEntries.empty')}</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {entries.map((entry) => (
        <div key={entry.id} className={styles.card}>

          <span className={styles.date}>{formatDate(entry.date)}</span>

          <span className={styles.hours}>{entry.hoursWorked.toFixed(1)} h</span>

          <div className={styles.actions}>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnEdit} ${isInactive ? styles.iconBtnDisabled : ''}`}
              onClick={() => isInactive ? onInactiveAction?.() : onEdit(entry)}
              title={t('timeEntries.actions.edit')}
              aria-label={t('timeEntries.actions.edit')}
              aria-disabled={isInactive}
            >
              <EditIcon />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnDanger} ${isInactive ? styles.iconBtnDisabled : ''}`}
              onClick={() => isInactive ? onInactiveAction?.() : onDelete(entry)}
              title={t('timeEntries.actions.delete')}
              aria-label={t('timeEntries.actions.delete')}
              aria-disabled={isInactive}
            >
              <DeleteIcon />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
