import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { prisma } from './lib/prisma';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
  });
});

app.get('/employees', async (c) => {
  const employees = await prisma.employee.findMany();

  return c.json(employees);
});

app.post('/employees', async (c) => {
  const body = await c.req.json();

  const employee = await prisma.employee.create({
    data: {
      name: body.name,
      role: body.role,
      hourlyRate: Number(body.hourlyRate),
    },
  });

  return c.json(employee, 201);
});

app.get('/time-entries', async (c) => {
  const entries = await prisma.timeEntry.findMany({
    include: {
      employee: true,
    },
  });

  return c.json(entries);
});

app.post('/time-entries', async (c) => {
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

app.patch('/time-entries/:id/approve', async (c) => {
  const id = c.req.param('id');

  const entry = await prisma.timeEntry.update({
    where: { id },
    data: {
      status: 'APPROVED',
    },
  });

  return c.json(entry);
});

app.patch('/time-entries/:id/reject', async (c) => {
  const id = c.req.param('id');

  const entry = await prisma.timeEntry.update({
    where: { id },
    data: {
      status: 'REJECTED',
    },
  });

  return c.json(entry);
});

const port = 3000;

console.log(`API running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});