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

function initials(name: string, lastName: string): string {
  return `${name[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
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
      <div className={styles.empty}>
        <p>{t('employees.empty')}</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {employees.map((emp) => (
        <div key={emp.id} className={styles.card}>

          {/* ── Left: avatar + name + rate ────────────────────────── */}
          <div className={styles.main}>
            <div className={styles.avatar}>{initials(emp.name, emp.lastName)}</div>
            <div className={styles.info}>
              <span className={styles.name}>{emp.name} {emp.lastName}</span>
              <span className={styles.rate}>${emp.hourlyRate.toFixed(2)}/hr</span>
            </div>
          </div>

          {/* ── Right: status + actions ───────────────────────────── */}
          <div className={styles.secondary}>
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
          </div>

        </div>
      ))}
    </div>
  );
}
