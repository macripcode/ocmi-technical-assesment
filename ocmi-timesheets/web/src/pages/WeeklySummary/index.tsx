import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeeklySummaryEntry, WeeklyStatus } from '../../types/weeklySummary';
import { WeeklySummaryCard } from '../../components/WeeklySummaryCard';
import { PrevIcon, NextIcon } from '../../components/Icons';
import { mockEmployees } from '../Employees/mockData';
import { mockTimeEntries } from '../TimeEntries/mockData';
import styles from './WeeklySummary.module.css';

// ── Date helpers ────────────────────────────────────────────────────

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // anchor on Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDate(d: Date): string {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  return `${fmt(start)} – ${fmt(end)}`;
}

// ── Initial approval seeds (for demo) ──────────────────────────────
// María López (id: '3') is pre-approved for the Jun 08 week
const INITIAL_APPROVALS: Record<string, WeeklyStatus> = {
  '3-2026-06-08': 'APPROVED',
};

// ── Page ─────────────────────────────────────────────────────────────

export function WeeklySummaryPage() {
  const { t } = useTranslation();

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [approvals, setApprovals] =
    useState<Record<string, WeeklyStatus>>(INITIAL_APPROVALS);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const startISO = isoDate(weekStart);
  const endISO   = isoDate(weekEnd);

  // Compute summary for each active employee who logged hours this week
  const summaries: WeeklySummaryEntry[] = mockEmployees
    .filter((emp) => emp.status === 'ACTIVE')
    .map((emp) => {
      const weekEntries = mockTimeEntries.filter(
        (e) => e.employeeId === emp.id && e.date >= startISO && e.date <= endISO
      );
      const totalHours  = weekEntries.reduce((s, e) => s + e.hours, 0);
      const regular     = Math.min(totalHours, 40);
      const overtime    = Math.max(totalHours - 40, 0);
      const regularPay  = regular  * emp.hourlyRate;
      const overtimePay = overtime * emp.hourlyRate * 1.5;
      const key         = `${emp.id}-${startISO}`;

      return {
        employeeId:    emp.id,
        employeeName:  `${emp.name} ${emp.lastName}`,
        regularHours:  regular,
        overtimeHours: overtime,
        regularPay,
        overtimePay,
        totalPay:      regularPay + overtimePay,
        status:        approvals[key] ?? 'PENDING',
      };
    })
    .filter((s) => s.regularHours > 0 || s.overtimeHours > 0);

  function navigate(dir: -1 | 1) {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  }

  function handleApprove(employeeId: string) {
    setApprovals((prev) => ({ ...prev, [`${employeeId}-${startISO}`]: 'APPROVED' }));
  }

  function handleReject(employeeId: string) {
    setApprovals((prev) => ({ ...prev, [`${employeeId}-${startISO}`]: 'REJECTED' }));
  }

  return (
    <div className={styles.page}>

      {/* ── Week navigation ─────────────────────────────────────── */}
      <div className={styles.weekNav}>
        <span className={styles.weekOfLabel}>{t('weeklySummary.weekOf')}</span>
        <button
          className={styles.navBtn}
          onClick={() => navigate(-1)}
          aria-label="Previous week"
        >
          <PrevIcon />
        </button>
        <span className={styles.weekRange}>{formatWeekRange(weekStart)}</span>
        <button
          className={styles.navBtn}
          onClick={() => navigate(1)}
          aria-label="Next week"
        >
          <NextIcon />
        </button>
      </div>

      {/* ── Employee cards ──────────────────────────────────────── */}
      {summaries.length === 0 ? (
        <div className={styles.empty}>
          <p>{t('weeklySummary.noEntries')}</p>
        </div>
      ) : (
        <div className={styles.list}>
          {summaries.map((entry) => (
            <WeeklySummaryCard
              key={entry.employeeId}
              entry={entry}
              onApprove={() => handleApprove(entry.employeeId)}
              onReject={() => handleReject(entry.employeeId)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
