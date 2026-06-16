import { Hono } from 'hono';
import { prisma } from '../lib/prisma';

type WeeklySummaryItem = {
  employeeId: string;
  employeeName: string;
  totalHours: number;
  hourlyRate: number;
  totalPay: number;
};

export const reportsRoutes = new Hono();

reportsRoutes.get('/weekly', async (c) => {
  const entries = await prisma.timeEntry.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      employee: true,
    },
  });

  const summary = entries.reduce<WeeklySummaryItem[]>((acc, entry) => {
    const existing = acc.find((item) => item.employeeId === entry.employeeId);

    if (existing) {
      existing.totalHours += entry.hoursWorked;
      existing.totalPay += entry.hoursWorked * entry.employee.hourlyRate;
    } else {
      acc.push({
        employeeId: entry.employeeId,
        employeeName: entry.employee.name,
        totalHours: entry.hoursWorked,
        hourlyRate: entry.employee.hourlyRate,
        totalPay: entry.hoursWorked * entry.employee.hourlyRate,
      });
    }

    return acc;
  }, []);

  return c.json(summary);
});
