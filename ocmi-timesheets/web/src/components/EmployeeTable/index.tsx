import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { Button } from '../Button';
import styles from './EmployeeTable.module.css';

interface EmployeeTableProps {
  employees:    Employee[];
  onEdit:       (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onReactivate: (employee: Employee) => void;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function EmployeeTable({
  employees,
  onEdit,
  onDeactivate,
  onReactivate,
}: EmployeeTableProps) {
  const { t } = useTranslation();

  if (employees.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>{t('employees.empty')}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>{t('employees.table.name')}</th>
            <th className={styles.th}>{t('employees.table.hourlyRate')}</th>
            <th className={styles.th}>{t('employees.table.status')}</th>
            <th className={styles.th}>{t('employees.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.nameCell}>
                  <div className={styles.avatar}>{initials(emp.name)}</div>
                  <div>
                    <div className={styles.nameText}>{emp.name}</div>
                    <div className={styles.roleText}>{emp.role}</div>
                  </div>
                </div>
              </td>

              <td className={styles.td}>
                ${emp.hourlyRate.toFixed(2)}/hr
              </td>

              <td className={styles.td}>
                {emp.status === 'ACTIVE' ? (
                  <span className={`${styles.badge} ${styles.badgeActive}`}>
                    <span className={styles.dot} />
                    {t('employees.status.active')}
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeInactive}`}>
                    <span className={styles.dot} />
                    {t('employees.status.inactive')}
                  </span>
                )}
              </td>

              <td className={styles.td}>
                <div className={styles.actions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(emp)}
                  >
                    {t('employees.actions.edit')}
                  </Button>

                  {emp.status === 'ACTIVE' ? (
                    <Button
                      variant="ghostDanger"
                      size="sm"
                      onClick={() => onDeactivate(emp)}
                    >
                      {t('employees.actions.deactivate')}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReactivate(emp)}
                    >
                      {t('employees.actions.reactivate')}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
