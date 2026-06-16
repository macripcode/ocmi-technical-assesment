import { Hono } from 'hono';
import { prisma } from '../lib/prisma';

export const employeesRoutes = new Hono();

employeesRoutes.get('/', async (c) => {
  const employees = await prisma.employee.findMany();

  return c.json(employees);
});

employeesRoutes.post('/', async (c) => {
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
