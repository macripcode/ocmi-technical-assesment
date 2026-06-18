import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TimeEntry } from '../../types/timeEntry';
import { Button } from '../../components/Button';
import { TimeEntryList } from '../../components/TimeEntryList';
import { mockEmployees } from '../Employees/mockData';
import { mockTimeEntries } from './mockData';
import styles from './TimeEntries.module.css';

const PAGE_SIZE = 10;

export function TimeEntriesPage() {
  const { t } = useTranslation();
  const dateRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries]                     = useState<TimeEntry[]>(mockTimeEntries);
  const [selectedEmployeeId, setSelectedEmployee] = useState(mockEmployees[0].id);
  const [logDate, setLogDate]                     = useState('');
  const [logHours, setLogHours]                   = useState('');
  const [page, setPage]                           = useState(1);

  const visibleEntries = [...entries]
    .filter((e) => e.employeeId === selectedEmployeeId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalPages = Math.max(1, Math.ceil(visibleEntries.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = visibleEntries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleEmployeeChange(id: string) {
    setSelectedEmployee(id);
    setPage(1);
  }

  function handleEdit(entry: TimeEntry) {
    setLogDate(entry.date);
    setLogHours(String(entry.hours));
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== entry.id);
      setPage(Math.min(page, Math.max(1, Math.ceil(next.filter(e => e.employeeId === selectedEmployeeId).length / PAGE_SIZE))));
      return next;
    });
    dateRef.current?.focus();
  }

  function handleDelete(entry: TimeEntry) {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== entry.id);
      const newTotal = Math.max(1, Math.ceil(next.filter(e => e.employeeId === selectedEmployeeId).length / PAGE_SIZE));
      setPage((p) => Math.min(p, newTotal));
      return next;
    });
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    const hours = parseFloat(logHours);
    if (!logDate || isNaN(hours) || hours <= 0) return;
    setEntries((prev) => {
      const next = [...prev, { id: `te-${Date.now()}`, employeeId: selectedEmployeeId, date: logDate, hours }];
      const employeeEntries = next.filter(e => e.employeeId === selectedEmployeeId);
      setPage(Math.ceil(employeeEntries.length / PAGE_SIZE));
      return next;
    });
    setLogDate('');
    setLogHours('');
  }

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('timeEntries.title')}</h1>

        <div className={styles.controls}>
          <label className={styles.selectWrapper}>
            <span className={styles.selectLabel}>{t('timeEntries.selectEmployee')}:</span>
            <select
              className={styles.select}
              value={selectedEmployeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
            >
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} {emp.lastName}</option>
              ))}
            </select>
          </label>

          <Button
            variant="primary"
            size="md"
            onClick={() => dateRef.current?.focus()}
          >
            {t('timeEntries.addEntry')}
          </Button>
        </div>
      </div>

      {/* ── Entry list ──────────────────────────────────────────── */}
      <TimeEntryList
        entries={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Pagination ──────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`${styles.pageBtn} ${n === safePage ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(n)}
              aria-current={n === safePage ? 'page' : undefined}
            >
              {n}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}

      {/* ── Log time form ────────────────────────────────────────── */}
      <section className={styles.logSection}>
        <form className={styles.logForm} onSubmit={handleSave} noValidate>
          <span className={styles.logLabel}>{t('timeEntries.form.label')}:</span>

          <div className={styles.logFields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t('timeEntries.form.date')}</span>
              <input
                ref={dateRef}
                className={styles.input}
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t('timeEntries.form.hours')}</span>
              <input
                className={styles.input}
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={logHours}
                onChange={(e) => setLogHours(e.target.value)}
                placeholder="0.0"
                required
              />
            </label>
          </div>

          <Button type="submit" variant="primary" size="md">
            {t('timeEntries.form.save')}
          </Button>
        </form>
      </section>

    </div>
  );
}
