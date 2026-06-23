import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { getWeekStart, calculateWeeklySummary, type WeeklyTimesheetStatus } from '@ocmi-timesheets/shared';

export const reportsRoutes = new Hono();

reportsRoutes.get('/weekly', async (c) => {
  const startDateParam = c.req.query('startDate');

  if (!startDateParam) {
    return c.json({ message: 'startDate query parameter is required' }, 400);
  }

  const weekStart = getWeekStart(new Date(startDateParam));
  const weekEnd   = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 7);

  const entriesPromise = prisma.timeEntry.findMany({
    where:   { date: { gte: weekStart, lt: weekEnd } },
    include: { employee: true },
  });
  const timesheetsPromise = prisma.weeklyTimesheet.findMany({ where: { weekStart } });

  const [entries, timesheets] = await Promise.all([entriesPromise, timesheetsPromise]);

  const timesheetByEmployee = new Map<string, WeeklyTimesheetStatus>(
    timesheets.map((t: { employeeId: string; status: WeeklyTimesheetStatus }) => [t.employeeId, t.status])
  );

  const summaryMap = new Map<string, {
    employeeId:   string;
    employeeName: string;
    hourlyRate:   number;
    totalHours:   number;
  }>();

  for (const entry of entries) {
    const existing = summaryMap.get(entry.employeeId);
    if (existing) {
      existing.totalHours += entry.hoursWorked;
    } else {
      summaryMap.set(entry.employeeId, {
        employeeId:   entry.employeeId,
        employeeName: `${entry.employee.name} ${entry.employee.lastName}`,
        hourlyRate:   entry.employee.hourlyRate,
        totalHours:   entry.hoursWorked,
      });
    }
  }

  const summary = Array.from(summaryMap.values()).map(
    ({ employeeId, employeeName, hourlyRate, totalHours }) => {
      const { regularHours, overtimeHours, regularPay, overtimePay, totalPay } =
        calculateWeeklySummary(totalHours, hourlyRate);

      return {
        employeeId,
        employeeName,
        hourlyRate,
        totalHours,
        regularHours,
        overtimeHours,
        regularPay,
        overtimePay,
        totalPay,
        approvalStatus: timesheetByEmployee.get(employeeId) ?? 'PENDING',
      };
    }
  );

  return c.json({ weekStart, weekEnd, summary });
});
