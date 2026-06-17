import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { getWeekStart } from '@ocmi-timesheets/shared';

export const timeEntriesRoutes = new Hono();

timeEntriesRoutes.get('/', async (c) => {
  const entries = await prisma.timeEntry.findMany({
    include: {
      employee: true,
    },
  });

  return c.json(entries);
});

timeEntriesRoutes.post('/', async (c) => {
  const body = await c.req.json();

  const weekStart = getWeekStart(new Date(body.date));

  const lockedTimesheet = await prisma.weeklyTimesheet.findUnique({
    where: {
      employeeId_weekStart: {
        employeeId: body.employeeId,
        weekStart,
      },
    },
  });

  if (lockedTimesheet?.status === 'APPROVED') {
    return c.json({ message: 'This week is approved and locked' }, 409);
  }

  const entry = await prisma.timeEntry.create({
    data: {
      employeeId: body.employeeId,
      date: new Date(body.date),
      hoursWorked: body.hoursWorked,
      notes: body.notes,
    },
  });

  return c.json(entry, 201);
});
