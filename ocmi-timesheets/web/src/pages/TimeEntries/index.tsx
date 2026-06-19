import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import type { TimeEntry } from '../../types/timeEntry';
import { Button } from '../../components/Button';
import { EmployeeCardSelector } from '../../components/EmployeeCardSelector';
import { TimeEntryForm } from '../../components/TimeEntryForm';
import { TimeEntryList } from '../../components/TimeEntryList';
import { fetchEmployees } from '../../lib/employeeApi';
import {
  fetchTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from '../../lib/timeEntryApi';
import styles from './TimeEntries.module.css';

const PAGE_SIZE = 10;

interface FormState {
  open:   boolean;
  entry?: TimeEntry;
}

export function TimeEntriesPage() {
  const { t } = useTranslation();

  const [employees,          setEmployees]        = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployee] = useState('');
  const [entries,            setEntries]          = useState<TimeEntry[]>([]);
  const [loadingEmp,         setLoadingEmp]       = useState(true);
  const [loadingEntries,     setLoadingEntries]   = useState(false);
  const [toast,              setToast]            = useState<string | null>(null);
  const [formState,          setFormState]        = useState<FormState>({ open: false });
  const [page,               setPage]             = useState(1);

  // ── Auto-dismiss toast ────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // ── Load employees on mount ───────────────────────────────────────
  useEffect(() => {
    fetchEmployees(false)
      .then((data) => {
        setEmployees(data);
        const first = [...data]
          .filter((e) => e.status === 'ACTIVE')
          .sort((a, b) => a.name.localeCompare(b.name))[0];
        if (first) setSelectedEmployee(first.id);
      })
      .catch(() => setToast('No se pudieron cargar los empleados.'))
      .finally(() => setLoadingEmp(false));
  }, []);

  // ── Load entries when employee changes ────────────────────────────
  useEffect(() => {
    if (!selectedEmployeeId) return;
    let cancelled = false;
    setLoadingEntries(true);
    setPage(1);

    fetchTimeEntries(selectedEmployeeId)
      .then((data) => { if (!cancelled) setEntries(data); })
      .catch(() => { if (!cancelled) setToast('No se pudieron cargar los registros.'); })
      .finally(() => { if (!cancelled) setLoadingEntries(false); });

    return () => { cancelled = true; };
  }, [selectedEmployeeId]);

  // ── Pagination ────────────────────────────────────────────────────
  const sorted     = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────────────────
  function openAdd()              { setFormState({ open: true }); }
  function openEdit(e: TimeEntry) { setFormState({ open: true, entry: e }); }
  function closeForm()            { setFormState({ open: false }); }

  function handleEmployeeChange(id: string) {
    setSelectedEmployee(id);
    setPage(1);
  }

  async function handleSave(data: { date: string; hoursWorked: number }) {
    if (formState.entry) {
      // ── Edit ──────────────────────────────────────────────────────
      const original = formState.entry;
      const patch: { date?: string; hoursWorked?: number } = {};
      if (data.date        !== original.date)        patch.date        = data.date;
      if (data.hoursWorked !== original.hoursWorked) patch.hoursWorked = data.hoursWorked;
      if (Object.keys(patch).length === 0) { closeForm(); return; }

      // Optimistic
      const optimistic = { ...original, ...patch, updatedAt: new Date().toISOString() };
      setEntries((prev) => prev.map((e) => (e.id === original.id ? optimistic : e)));
      closeForm();

      try {
        const updated = await updateTimeEntry(original.id, patch);
        setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      } catch (err) {
        setEntries((prev) => prev.map((e) => (e.id === original.id ? original : e)));
        setToast(err instanceof Error && err.message === 'LOCKED'
          ? 'Esta semana está aprobada y bloqueada.'
          : 'No se pudo actualizar el registro.');
      }
    } else {
      // ── Create (optimistic) ───────────────────────────────────────
      const tempId  = `temp-${Date.now()}`;
      const now     = new Date().toISOString();
      const optimistic: TimeEntry = {
        id:          tempId,
        employeeId:  selectedEmployeeId,
        date:        data.date,
        hoursWorked: data.hoursWorked,
        createdAt:   now,
        updatedAt:   now,
      };

      setEntries((prev) => {
        const next = [...prev, optimistic];
        setPage(Math.ceil(next.length / PAGE_SIZE));
        return next;
      });
      closeForm();

      try {
        const created = await createTimeEntry({
          employeeId:  selectedEmployeeId,
          date:        data.date,
          hoursWorked: data.hoursWorked,
        });
        setEntries((prev) => prev.map((e) => (e.id === tempId ? created : e)));
      } catch (err) {
        setEntries((prev) => prev.filter((e) => e.id !== tempId));
        setToast(err instanceof Error && err.message === 'LOCKED'
          ? 'Esta semana está aprobada y bloqueada.'
          : 'No se pudo crear el registro.');
      }
    }
  }

  async function handleDelete(entry: TimeEntry) {
    // Optimistic remove
    setEntries((prev) => {
      const next     = prev.filter((e) => e.id !== entry.id);
      const newTotal = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
      setPage((p) => Math.min(p, newTotal));
      return next;
    });

    try {
      await deleteTimeEntry(entry.id);
    } catch (err) {
      setEntries((prev) => [...prev, entry]);
      setToast(err instanceof Error && err.message === 'LOCKED'
        ? 'Esta semana está aprobada y bloqueada.'
        : 'No se pudo eliminar el registro.');
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Toast ──────────────────────────────────────────────── */}
      {toast && (
        <div className={styles.toast}>
          {toast}
          <button className={styles.toastClose} onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('timeEntries.title')}</h1>
        <p className={styles.subtitle}>{t('timeEntries.subtitle')}</p>
      </div>

      {/* ── Employee selector + Log time ─────────────────────────── */}
      {!loadingEmp && employees.length > 0 && (
        <div className={styles.selectorRow}>
          <div className={styles.selectorBlock}>
            <span className={styles.selectorLabel}>{t('timeEntries.selectEmployee')}</span>
            <EmployeeCardSelector
              employees={employees}
              selectedId={selectedEmployeeId}
              onChange={handleEmployeeChange}
            />
          </div>

          <Button variant="primary" size="md" onClick={openAdd} className={styles.logBtn}>
            {t('timeEntries.addEntry')}
          </Button>
        </div>
      )}

      {/* ── Loading / list ──────────────────────────────────────── */}
      {loadingEmp || loadingEntries ? (
        <p className={styles.feedback}>Loading…</p>
      ) : (
        <>
          <TimeEntryList
            entries={paginated}
            onEdit={openEdit}
            onDelete={handleDelete}
          />

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
        </>
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
