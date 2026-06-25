import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateTimeEntrySchema } from '@ocmi-timesheets/shared';
import type { TimeEntry } from '../../types/timeEntry';
import { Button } from '../Button';
import { CloseIcon } from '../Icons';
import styles from './TimeEntryForm.module.css';

const EntryFieldsSchema = CreateTimeEntrySchema.pick({ date: true, hoursWorked: true });

interface TimeEntryFormProps {
  entry?:   TimeEntry;
  onSave:   (data: { date: string; hoursWorked: number }) => void;
  onClose:  () => void;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function TimeEntryForm({ entry, onSave, onClose }: TimeEntryFormProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(entry);
  const today  = todayISO();

  const [date,  setDate]  = useState(entry?.date  ?? '');
  const [hours, setHours] = useState(entry ? String(entry.hoursWorked) : '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (date > today) {
      setError(t('timeEntries.form.dateFuture'));
      return;
    }
    const result = EntryFieldsSchema.safeParse({ date, hoursWorked: Number(hours) });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onSave(result.data);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="te-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="te-form-title" className={styles.title}>
            {isEdit ? t('timeEntries.form.titleEdit') : t('timeEntries.form.titleAdd')}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t('timeEntries.form.cancel')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form className={styles.body} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="te-date">
              {t('timeEntries.form.date')}
            </label>
            <input
              id="te-date"
              className={styles.input}
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="te-hours">
              {t('timeEntries.form.hours')}
            </label>
            <input
              id="te-hours"
              className={styles.input}
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0.0"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              {t('timeEntries.form.cancel')}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {t('timeEntries.form.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
