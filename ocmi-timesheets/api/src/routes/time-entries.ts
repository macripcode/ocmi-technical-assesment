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

timeEntriesRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const entry = await prisma.timeEntry.findUnique({ where: { id } });

  if (!entry) {
    return c.json({ message: 'Time entry not found' }, 404);
  }

  const weekStarts = [getWeekStart(entry.date)];
  if (body.date !== undefined) {
    const newWeekStart = getWeekStart(new Date(body.date));
    if (newWeekStart.getTime() !== weekStarts[0].getTime()) {
      weekStarts.push(newWeekStart);
    }
  }

  const lockedTimesheets = await prisma.weeklyTimesheet.findMany({
    where: {
      employeeId: entry.employeeId,
      weekStart: { in: weekStarts },
      status: 'APPROVED',
    },
  });

  if (lockedTimesheets.length > 0) {
    return c.json({ message: 'This week is approved and locked' }, 409);
  }

  const updated = await prisma.timeEntry.update({
    where: { id },
    data: {
      date: body.date !== undefined ? new Date(body.date) : undefined,
      hoursWorked: body.hoursWorked,
      notes: body.notes,
    },
  });

  return c.json(updated);
});
