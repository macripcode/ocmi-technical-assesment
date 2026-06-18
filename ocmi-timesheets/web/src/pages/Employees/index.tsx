import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { EmployeeForm } from '../../components/EmployeeForm';
import { EmployeeTable } from '../../components/EmployeeTable';
import { mockEmployees } from './mockData';
import styles from './Employees.module.css';

// ── Sort types ───────────────────────────────────────────────────────
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

// ── Form state ───────────────────────────────────────────────────────
interface FormState {
  open:      boolean;
  employee?: Employee;
}

// ── Page ─────────────────────────────────────────────────────────────
export function EmployeesPage() {
  const { t } = useTranslation();

  const [employees,    setEmployees]    = useState<Employee[]>(mockEmployees);
  const [showInactive, setShowInactive] = useState(false);
  const [formState,    setFormState]    = useState<FormState>({ open: false });
  const [sortField,    setSortField]    = useState<SortField>('name');
  const [sortDir,      setSortDir]      = useState<SortDir>('asc');

  const visible = showInactive
    ? employees
    : employees.filter((e) => e.status === 'ACTIVE');

  const sorted = sortEmployees(visible, sortField, sortDir);

  function handleSortFieldChange(field: SortField) {
    setSortField(field);
    setSortDir('asc'); // reset direction when field changes
  }

  function openAdd() { setFormState({ open: true }); }
  function openEdit(emp: Employee) { setFormState({ open: true, employee: emp }); }
  function closeForm() { setFormState({ open: false }); }

  function handleFormSave(data: { name: string; lastName: string; hourlyRate: number }) {
    if (formState.employee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === formState.employee!.id
            ? { ...e, ...data, updatedAt: new Date() }
            : e
        )
      );
    } else {
      const now = new Date();
      const next: Employee = {
        id:         `emp-${Date.now()}`,
        name:       data.name,
        lastName:   data.lastName,
        hourlyRate: data.hourlyRate,
        status:     'ACTIVE',
        createdAt:  now,
        updatedAt:  now,
      };
      setEmployees((prev) => [...prev, next]);
    }
    closeForm();
  }

  function handleDeactivate(emp: Employee) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: 'INACTIVE' } : e))
    );
  }

  function handleReactivate(emp: Employee) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: 'ACTIVE' } : e))
    );
  }

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
          onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
        >
          <option value="name">{t('employees.sort.name')}</option>
          <option value="lastName">{t('employees.sort.lastName')}</option>
          <option value="createdAt">{t('employees.sort.createdAt')}</option>
          <option value="updatedAt">{t('employees.sort.updatedAt')}</option>
        </select>

        <select
          className={styles.sortSelect}
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as SortDir)}
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

      {/* ── Employee list ──────────────────────────────────────── */}
      <EmployeeTable
        employees={sorted}
        onEdit={openEdit}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
      />

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
