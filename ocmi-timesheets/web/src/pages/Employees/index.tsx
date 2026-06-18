import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { EmployeeForm } from '../../components/EmployeeForm';
import { EmployeeTable } from '../../components/EmployeeTable';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from '../../lib/employeeApi';
import styles from './Employees.module.css';

// ── Sort ─────────────────────────────────────────────────────────────
type SortField = 'name' | 'lastName' | 'createdAt' | 'updatedAt';
type SortDir   = 'asc' | 'desc';

function isDateField(f: SortField): f is 'createdAt' | 'updatedAt' {
  return f === 'createdAt' || f === 'updatedAt';
}

function sortEmployees(list: Employee[], field: SortField, dir: SortDir): Employee[] {
  return [...list].sort((a, b) => {
    const cmp = isDateField(field)
      ? a[field].getTime() - b[field].getTime()
      : a[field].localeCompare(b[field], undefined, { sensitivity: 'base' });
    return dir === 'asc' ? cmp : -cmp;
  });
}

// ── Constants ─────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ── Form state ───────────────────────────────────────────────────────
interface FormState {
  open:      boolean;
  employee?: Employee;
}

// ── Page ─────────────────────────────────────────────────────────────
export function EmployeesPage() {
  const { t } = useTranslation();

  const [employees,    setEmployees]    = useState<Employee[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [formState,    setFormState]    = useState<FormState>({ open: false });
  const [sortField,    setSortField]    = useState<SortField>('name');
  const [sortDir,      setSortDir]      = useState<SortDir>('asc');
  const [page,         setPage]         = useState(1);

  // ── Load employees ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(1);

    fetchEmployees(showInactive)
      .then((data) => { if (!cancelled) setEmployees(data); })
      .catch(() => { if (!cancelled) setError('Could not load employees.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [showInactive]);

  // ── Derived list ──────────────────────────────────────────────────
  const sorted     = sortEmployees(employees, sortField, sortDir);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────────────────
  function openAdd()  { setFormState({ open: true }); }
  function openEdit(emp: Employee) { setFormState({ open: true, employee: emp }); }
  function closeForm() { setFormState({ open: false }); }

  function handleSortField(field: SortField) {
    setSortField(field);
    setSortDir('asc');
    setPage(1);
  }

  async function handleFormSave(data: { name: string; lastName: string; hourlyRate: number }) {
    try {
      if (formState.employee) {
        const updated = await updateEmployee(formState.employee.id, data);
        setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      } else {
        const created = await createEmployee(data);
        setEmployees((prev) => {
          const next = [...prev, created];
          // Jump to the last page so the new employee is visible
          setPage(Math.ceil(next.length / PAGE_SIZE));
          return next;
        });
      }
      closeForm();
    } catch {
      alert('Error saving employee. Please try again.');
    }
  }

  async function handleDeactivate(emp: Employee) {
    try {
      const deactivated = await deactivateEmployee(emp.id);
      setEmployees((prev) => {
        const next = showInactive
          ? prev.map((e) => (e.id === emp.id ? deactivated : e))
          : prev.filter((e) => e.id !== emp.id);
        // If current page becomes empty after removal, go back one page
        const newTotal = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        setPage((p) => Math.min(p, newTotal));
        return next;
      });
    } catch {
      alert('Error deactivating employee. Please try again.');
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('employees.title')}</h1>
        <div className={styles.controls}>
          <Checkbox
            id="show-inactive"
            label={t('employees.showInactive')}
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          <Button variant="primary" size="md" onClick={openAdd}>
            {t('employees.addEmployee')}
          </Button>
        </div>
      </div>

      {/* ── Sort bar ───────────────────────────────────────────── */}
      <div className={styles.sortBar}>
        <span className={styles.sortLabel}>{t('employees.sort.label')}:</span>

        <select
          className={styles.sortSelect}
          value={sortField}
          onChange={(e) => handleSortField(e.target.value as SortField)}
        >
          <option value="name">{t('employees.sort.name')}</option>
          <option value="lastName">{t('employees.sort.lastName')}</option>
          <option value="createdAt">{t('employees.sort.createdAt')}</option>
          <option value="updatedAt">{t('employees.sort.updatedAt')}</option>
        </select>

        <select
          className={styles.sortSelect}
          value={sortDir}
          onChange={(e) => { setSortDir(e.target.value as SortDir); setPage(1); }}
        >
          {isDateField(sortField) ? (
            <>
              <option value="desc">{t('employees.sort.newest')}</option>
              <option value="asc">{t('employees.sort.oldest')}</option>
            </>
          ) : (
            <>
              <option value="asc">{t('employees.sort.asc')}</option>
              <option value="desc">{t('employees.sort.desc')}</option>
            </>
          )}
        </select>
      </div>

      {/* ── States ─────────────────────────────────────────────── */}
      {loading && <p className={styles.feedback}>Loading…</p>}
      {error   && <p className={styles.feedbackError}>{error}</p>}

      {/* ── Employee list ──────────────────────────────────────── */}
      {!loading && !error && (
        <>
          <EmployeeTable
            employees={paginated}
            onEdit={openEdit}
            onDeactivate={handleDeactivate}
            onReactivate={() => {}}
          />

          {/* ── Pagination ───────────────────────────────────── */}
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
        </>
      )}

      {formState.open && (
        <EmployeeForm
          employee={formState.employee}
          onSave={handleFormSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
