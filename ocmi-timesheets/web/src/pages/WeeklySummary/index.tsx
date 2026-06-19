import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeeklySummaryEntry, WeeklyStatus } from '../../types/weeklySummary';
import { WeeklySummaryCard } from '../../components/WeeklySummaryCard';
import { PrevIcon, NextIcon } from '../../components/Icons';
import { fetchWeeklySummary, approveWeek, rejectWeek } from '../../lib/weeklyApi';
import styles from './WeeklySummary.module.css';

const PAGE_SIZE = 10;

// ── Date helpers (UTC to match the API's getWeekStart) ────────────────
function getWeekStart(date: Date): Date {
  const d   = new Date(date);
  const day  = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0]; // YYYY-MM-DD in UTC
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

// ── Page ──────────────────────────────────────────────────────────────
export function WeeklySummaryPage() {
  const { t } = useTranslation();

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [summaries, setSummaries] = useState<WeeklySummaryEntry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState<string | null>(null);
  const [page,      setPage]      = useState(1);

  const startISO = isoDate(weekStart);

  // ── Auto-dismiss toast ──────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // ── Fetch summary when week changes ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);

    fetchWeeklySummary(startISO)
      .then((data) => { if (!cancelled) setSummaries(data); })
      .catch(() => { if (!cancelled) setToast('No se pudo cargar el resumen semanal.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [startISO]);

  // ── Pagination ──────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(summaries.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = summaries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Week navigation ─────────────────────────────────────────────────
  function navigate(dir: -1 | 1) {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setUTCDate(d.getUTCDate() + dir * 7);
      return d;
    });
  }

  // ── Approve / Reject (optimistic) ───────────────────────────────────
  function setStatus(employeeId: string, status: WeeklyStatus) {
    setSummaries((prev) =>
      prev.map((s) => (s.employeeId === employeeId ? { ...s, status } : s))
    );
  }

  async function handleApprove(employeeId: string) {
    const previous = summaries.find((s) => s.employeeId === employeeId)?.status ?? 'PENDING';
    setStatus(employeeId, 'APPROVED');
    try {
      await approveWeek(employeeId, startISO);
    } catch {
      setStatus(employeeId, previous);
      setToast('No se pudo aprobar la semana.');
    }
  }

  async function handleReject(employeeId: string) {
    const previous = summaries.find((s) => s.employeeId === employeeId)?.status ?? 'PENDING';
    setStatus(employeeId, 'REJECTED');
    try {
      await rejectWeek(employeeId, startISO);
    } catch {
      setStatus(employeeId, previous);
      setToast('No se pudo rechazar la semana.');
    }
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Toast ──────────────────────────────────────────────── */}
      {toast && (
        <div className={styles.toast}>
          {toast}
          <button className={styles.toastClose} onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* ── Week navigation ─────────────────────────────────────── */}
      <div className={styles.weekNav}>
        <span className={styles.weekOfLabel}>{t('weeklySummary.weekOf')}</span>
        <button className={styles.navBtn} onClick={() => navigate(-1)} aria-label="Previous week">
          <PrevIcon />
        </button>
        <span className={styles.weekRange}>{formatWeekRange(weekStart)}</span>
        <button className={styles.navBtn} onClick={() => navigate(1)} aria-label="Next week">
          <NextIcon />
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      {loading ? (
        <p className={styles.feedback}>Loading…</p>
      ) : summaries.length === 0 ? (
        <div className={styles.empty}>
          <p>{t('weeklySummary.noEntries')}</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {paginated.map((entry) => (
              <WeeklySummaryCard
                key={entry.employeeId}
                entry={entry}
                onApprove={() => handleApprove(entry.employeeId)}
                onReject={() => handleReject(entry.employeeId)}
              />
            ))}
          </div>

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

    </div>
  );
}
