import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { getWeekStart, CreateTimeEntrySchema, UpdateTimeEntrySchema } from '@ocmi-timesheets/shared';

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
  const result = CreateTimeEntrySchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ message: 'Invalid request', errors: result.error.issues }, 400);
  }

  const { employeeId, date, hoursWorked, notes } = result.data;
  const weekStart = getWeekStart(new Date(date));

  const lockedTimesheet = await prisma.weeklyTimesheet.findUnique({
    where: { employeeId_weekStart: { employeeId, weekStart } },
  });

  if (lockedTimesheet?.status === 'APPROVED') {
    return c.json({ message: 'This week is approved and locked' }, 409);
  }

  const entry = await prisma.timeEntry.create({
    data: { employeeId, date: new Date(date), hoursWorked, notes },
  });

  return c.json(entry, 201);
});

timeEntriesRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const result = UpdateTimeEntrySchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ message: 'Invalid request', errors: result.error.issues }, 400);
  }

  const entry = await prisma.timeEntry.findUnique({ where: { id } });

  if (!entry) {
    return c.json({ message: 'Time entry not found' }, 404);
  }

  const weekStarts = [getWeekStart(entry.date)];
  if (result.data.date !== undefined) {
    const newWeekStart = getWeekStart(new Date(result.data.date));
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
      date: result.data.date !== undefined ? new Date(result.data.date) : undefined,
      hoursWorked: result.data.hoursWorked,
      notes: result.data.notes,
    },
  });

  return c.json(updated);
});
