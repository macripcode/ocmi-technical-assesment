import { useTranslation } from 'react-i18next';
import type { WeeklySummaryEntry, WeeklyStatus } from '../../types/weeklySummary';
import { Button } from '../Button';
import { PendingIcon, ApprovedIcon, RejectedIcon, LockIcon } from '../Icons';
import styles from './WeeklySummaryCard.module.css';

interface WeeklySummaryCardProps {
  entry:     WeeklySummaryEntry;
  onApprove: () => void;
  onReject:  () => void;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const STATUS_ICON: Record<WeeklyStatus, React.ReactElement> = {
  PENDING:  <PendingIcon  />,
  APPROVED: <ApprovedIcon />,
  REJECTED: <RejectedIcon />,
};

const STATUS_CLASS: Record<WeeklyStatus, string> = {
  PENDING:  styles.badgePending,
  APPROVED: styles.badgeApproved,
  REJECTED: styles.badgeRejected,
};

export function WeeklySummaryCard({ entry, onApprove, onReject }: WeeklySummaryCardProps) {
  const { t } = useTranslation();
  const isPending = entry.status === 'PENDING';

  const statusLabels: Record<WeeklyStatus, string> = {
    PENDING:  t('weeklySummary.status.pending'),
    APPROVED: t('weeklySummary.status.approved'),
    REJECTED: t('weeklySummary.status.rejected'),
  };

  return (
    <div className={styles.card}>

      {/* ── Row 1: name + status badge ──────────────────────────── */}
      <div className={styles.cardHeader}>
        <span className={styles.name}>{entry.employeeName}</span>
        <span className={`${styles.badge} ${STATUS_CLASS[entry.status]}`}>
          {STATUS_ICON[entry.status]}
          {statusLabels[entry.status]}
        </span>
      </div>

      {/* ── Row 2: hours ────────────────────────────────────────── */}
      <p className={styles.hoursRow}>
        {t('weeklySummary.regular')} {entry.regularHours.toFixed(1)}h
        {' · '}
        {t('weeklySummary.overtime')} {entry.overtimeHours.toFixed(1)}h
      </p>

      {/* ── Row 3: pay breakdown ─────────────────────────────────── */}
      <p className={styles.payRow}>
        {entry.overtimeHours > 0 ? (
          <>
            {t('weeklySummary.pay')}: {fmt(entry.regularPay)}{' '}
            <span className={styles.op}>+</span>{' '}
            {fmt(entry.overtimePay)}{' '}
            <span className={styles.op}>=</span>{' '}
            <strong>{fmt(entry.totalPay)}</strong>
          </>
        ) : (
          <>
            {t('weeklySummary.pay')}: <strong>{fmt(entry.totalPay)}</strong>
          </>
        )}
      </p>

      {/* ── Row 4: actions or locked ─────────────────────────────── */}
      <div className={styles.cardFooter}>
        {isPending ? (
          <>
            <Button variant="primary"     size="sm" onClick={onApprove}>
              {t('weeklySummary.actions.approve')}
            </Button>
            <Button variant="ghostDanger" size="sm" onClick={onReject}>
              {t('weeklySummary.actions.reject')}
            </Button>
          </>
        ) : (
          <span className={styles.locked}>
            <LockIcon />
            {t('weeklySummary.locked')}
          </span>
        )}
      </div>

    </div>
  );
}
