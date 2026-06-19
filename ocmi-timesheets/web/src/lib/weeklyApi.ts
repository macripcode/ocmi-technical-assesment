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

export async function approveWeek(employeeId: string, weekStart: string): Promise<void> {
  const res = await fetch(
    `/api/weekly-timesheets/${encodeURIComponent(employeeId)}/${encodeURIComponent(weekStart)}/approve`,
    { method: 'PATCH' }
  );
  if (!res.ok) throw new Error('Failed to approve week');
}

export async function rejectWeek(employeeId: string, weekStart: string): Promise<void> {
  const res = await fetch(
    `/api/weekly-timesheets/${encodeURIComponent(employeeId)}/${encodeURIComponent(weekStart)}/reject`,
    { method: 'PATCH' }
  );
  if (!res.ok) throw new Error('Failed to reject week');
}
