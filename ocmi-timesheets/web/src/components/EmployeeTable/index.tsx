import { useTranslation } from 'react-i18next';
import type { Employee } from '../../types/employee';
import { EditIcon, DeactivateIcon, ReactivateIcon } from '../Icons';
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
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                    onClick={() => onEdit(emp)}
                    title={t('employees.actions.edit')}
                    aria-label={t('employees.actions.edit')}
                  >
                    <EditIcon />
                  </button>

                  {emp.status === 'ACTIVE' ? (
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => onDeactivate(emp)}
                      title={t('employees.actions.deactivate')}
                      aria-label={t('employees.actions.deactivate')}
                    >
                      <DeactivateIcon />
                    </button>
                  ) : (
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                      onClick={() => onReactivate(emp)}
                      title={t('employees.actions.reactivate')}
                      aria-label={t('employees.actions.reactivate')}
                    >
                      <ReactivateIcon />
                    </button>
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
