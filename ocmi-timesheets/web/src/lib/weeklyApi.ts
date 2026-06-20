import type { WeeklySummaryEntry, WeeklyStatus } from '../types/weeklySummary';

interface WeeklySummaryApiItem {
  employeeId:     string;
  employeeName:   string;
  regularHours:   number;
  overtimeHours:  number;
  regularPay:     number;
  overtimePay:    number;
  totalPay:       number;
  approvalStatus: WeeklyStatus;
}

interface WeeklyReportResponse {
  weekStart: string;
  weekEnd:   string;
  summary:   WeeklySummaryApiItem[];
}

export async function fetchWeeklySummary(startDate: string): Promise<WeeklySummaryEntry[]> {
  const res = await fetch(`/api/reports/weekly?startDate=${encodeURIComponent(startDate)}`);
  if (!res.ok) throw new Error('Failed to fetch weekly summary');

  const data: WeeklyReportResponse = await res.json();

  return data.summary.map((item) => ({
    employeeId:    item.employeeId,
    employeeName:  item.employeeName,
    regularHours:  item.regularHours,
    overtimeHours: item.overtimeHours,
    regularPay:    item.regularPay,
    overtimePay:   item.overtimePay,
    totalPay:      item.totalPay,
    status:        item.approvalStatus,
  }));
}

async function updateWeekStatus(employeeId: string, weekStart: string, action: 'approve' | 'reject'): Promise<void> {
  const res = await fetch(
    `/api/weekly-timesheets/${encodeURIComponent(employeeId)}/${encodeURIComponent(weekStart)}/${action}`,
    { method: 'PATCH' }
  );
  if (!res.ok) throw new Error(`Failed to ${action} week`);
}

export const approveWeek = (e: string, w: string) => updateWeekStatus(e, w, 'approve');
export const rejectWeek  = (e: string, w: string) => updateWeekStatus(e, w, 'reject');
