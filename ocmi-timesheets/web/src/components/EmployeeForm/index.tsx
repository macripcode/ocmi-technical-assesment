import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { Button } from '../Button';
import { CloseIcon } from '../Icons';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  /** Pass an existing employee to switch to edit mode. Omit for create mode. */
  employee?: Employee;
  onSave:  (data: { name: string; lastName: string; hourlyRate: number }) => void;
  onClose: () => void;
}

export function EmployeeForm({ employee, onSave, onClose }: EmployeeFormProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(employee);

  const [name,       setName]       = useState(employee?.name       ?? '');
  const [lastName,   setLastName]   = useState(employee?.lastName   ?? '');
  const [hourlyRate, setHourlyRate] = useState(
    employee ? String(employee.hourlyRate) : ''
  );

  // Scroll lock + Escape key
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
    const rate = parseFloat(hourlyRate);
    if (!name.trim() || !lastName.trim() || isNaN(rate) || rate <= 0) return;
    onSave({ name: name.trim(), lastName: lastName.trim(), hourlyRate: rate });
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="emp-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="emp-form-title" className={styles.title}>
            {isEdit ? t('employees.form.titleEdit') : t('employees.form.titleAdd')}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t('employees.form.cancel')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form className={styles.body} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="emp-name">
              {t('employees.form.name')}
            </label>
            <input
              id="emp-name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ana"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="emp-lastname">
              {t('employees.form.lastName')}
            </label>
            <input
              id="emp-lastname"
              className={styles.input}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. García"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="emp-rate">
              {t('employees.form.hourlyRate')}
            </label>
            <div className={styles.rateWrapper}>
              <span className={styles.ratePrefix}>$</span>
              <input
                id="emp-rate"
                className={`${styles.input} ${styles.rateInput}`}
                type="number"
                step="0.01"
                min="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              {t('employees.form.cancel')}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {t('employees.form.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
