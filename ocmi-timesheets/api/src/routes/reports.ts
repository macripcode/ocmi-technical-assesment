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
  const startDateParam = c.req.query('startDate');

  if (!startDateParam) {
    return c.json({ message: 'startDate query parameter is required' }, 400);
  }

  const startDate = new Date(startDateParam);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  const entries = await prisma.timeEntry.findMany({
    where: {
      status: 'APPROVED',
      date: {
        gte: startDate,
        lt: endDate,
      },
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

  return c.json({
    startDate,
    endDate,
    summary,
  });
});
