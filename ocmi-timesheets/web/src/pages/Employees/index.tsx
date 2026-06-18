import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { EmployeeTable } from '../../components/EmployeeTable';
import { mockEmployees } from './mockData';
import styles from './Employees.module.css';

export function EmployeesPage() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showInactive, setShowInactive] = useState(false);

  const visible = showInactive
    ? employees
    : employees.filter((e) => e.status === 'ACTIVE');

  function handleEdit(emp: Employee) {
    // TODO: open edit modal
    console.log('edit', emp);
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
          <Button variant="primary" size="md" onClick={() => console.log('add')}>
            {t('employees.addEmployee')}
          </Button>
        </div>
      </div>

      <EmployeeTable
        employees={visible}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
      />
    </div>
  );
}
