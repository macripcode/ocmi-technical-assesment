import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TimeEntry } from '../../types/timeEntry';
import { Button } from '../../components/Button';
import { EmployeeCardSelector } from '../../components/EmployeeCardSelector';
import { TimeEntryForm } from '../../components/TimeEntryForm';
import { TimeEntryList } from '../../components/TimeEntryList';
import { mockEmployees } from '../Employees/mockData';
import { mockTimeEntries } from './mockData';
import styles from './TimeEntries.module.css';

const PAGE_SIZE = 10;

// Default: first active employee sorted alphabetically by name
const defaultEmployee = [...mockEmployees]
  .filter((e) => e.status === 'ACTIVE')
  .sort((a, b) => a.name.localeCompare(b.name))[0];

interface FormState {
  open:   boolean;
  entry?: TimeEntry;
}

export function TimeEntriesPage() {
  const { t } = useTranslation();

  const [entries,            setEntries]          = useState<TimeEntry[]>(mockTimeEntries);
  const [selectedEmployeeId, setSelectedEmployee] = useState(defaultEmployee?.id ?? '');
  const [formState,          setFormState]        = useState<FormState>({ open: false });
  const [page,               setPage]             = useState(1);

  const visibleEntries = [...entries]
    .filter((e) => e.employeeId === selectedEmployeeId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalPages = Math.max(1, Math.ceil(visibleEntries.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = visibleEntries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function openAdd()               { setFormState({ open: true }); }
  function openEdit(e: TimeEntry)  { setFormState({ open: true, entry: e }); }
  function closeForm()             { setFormState({ open: false }); }

  function handleEmployeeChange(id: string) {
    setSelectedEmployee(id);
    setPage(1);
  }

  function handleSave(data: { date: string; hoursWorked: number }) {
    const now = new Date().toISOString();
    if (formState.entry) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === formState.entry!.id ? { ...e, ...data, updatedAt: now } : e
        )
      );
    } else {
      setEntries((prev) => {
        const next = [...prev, {
          id:          `te-${Date.now()}`,
          employeeId:  selectedEmployeeId,
          date:        data.date,
          hoursWorked: data.hoursWorked,
          createdAt:   now,
          updatedAt:   now,
        }];
        const empEntries = next.filter((e) => e.employeeId === selectedEmployeeId);
        setPage(Math.ceil(empEntries.length / PAGE_SIZE));
        return next;
      });
    }
    closeForm();
  }

  function handleDelete(entry: TimeEntry) {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== entry.id);
      const newTotal = Math.max(1, Math.ceil(
        next.filter((e) => e.employeeId === selectedEmployeeId).length / PAGE_SIZE
      ));
      setPage((p) => Math.min(p, newTotal));
      return next;
    });
  }

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('timeEntries.title')}</h1>
        <p className={styles.subtitle}>{t('timeEntries.subtitle')}</p>
      </div>

      {/* ── Employee selector + Log time ─────────────────────────── */}
      <div className={styles.selectorRow}>
        <div className={styles.selectorBlock}>
          <span className={styles.selectorLabel}>{t('timeEntries.selectEmployee')}</span>
          <EmployeeCardSelector
            employees={mockEmployees}
            selectedId={selectedEmployeeId}
            onChange={handleEmployeeChange}
          />
        </div>

        <Button variant="primary" size="md" onClick={openAdd} className={styles.logBtn}>
          {t('timeEntries.addEntry')}
        </Button>
      </div>

      {/* ── Entry list ──────────────────────────────────────────── */}
      <TimeEntryList
        entries={paginated}
        onEdit={openEdit}
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
          >‹</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`${styles.pageBtn} ${n === safePage ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(n)}
              aria-current={n === safePage ? 'page' : undefined}
            >{n}</button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >›</button>
        </div>
      )}

      {/* ── Form modal ──────────────────────────────────────────── */}
      {formState.open && (
        <TimeEntryForm
          entry={formState.entry}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
