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

const port = 3000;

console.log(`API running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});