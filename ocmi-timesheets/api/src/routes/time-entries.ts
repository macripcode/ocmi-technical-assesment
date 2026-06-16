import { Hono } from 'hono';
import { prisma } from '../lib/prisma';

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

timeEntriesRoutes.patch('/:id/approve', async (c) => {
  const id = c.req.param('id');

  const entry = await prisma.timeEntry.update({
    where: { id },
    data: {
      status: 'APPROVED',
    },
  });

  return c.json(entry);
});

timeEntriesRoutes.patch('/:id/reject', async (c) => {
  const id = c.req.param('id');

  const entry = await prisma.timeEntry.update({
    where: { id },
    data: {
      status: 'REJECTED',
    },
  });

  return c.json(entry);
});
