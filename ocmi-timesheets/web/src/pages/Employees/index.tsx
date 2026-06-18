import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { EmployeeForm } from '../../components/EmployeeForm';
import { EmployeeTable } from '../../components/EmployeeTable';
import { mockEmployees } from './mockData';
import styles from './Employees.module.css';

interface FormState {
  open:      boolean;
  employee?: Employee;
}

export function EmployeesPage() {
  const { t } = useTranslation();
  const [employees,    setEmployees]    = useState<Employee[]>(mockEmployees);
  const [showInactive, setShowInactive] = useState(false);
  const [formState,    setFormState]    = useState<FormState>({ open: false });

  const visible = showInactive
    ? employees
    : employees.filter((e) => e.status === 'ACTIVE');

  function openAdd() {
    setFormState({ open: true });
  }

  function openEdit(emp: Employee) {
    setFormState({ open: true, employee: emp });
  }

  function closeForm() {
    setFormState({ open: false });
  }

  function handleFormSave(data: { name: string; hourlyRate: number }) {
    if (formState.employee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === formState.employee!.id ? { ...e, ...data } : e
        )
      );
    } else {
      const next: Employee = {
        id:         `emp-${Date.now()}`,
        name:       data.name,
        hourlyRate: data.hourlyRate,
        status:     'ACTIVE',
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

      <EmployeeTable
        employees={visible}
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
