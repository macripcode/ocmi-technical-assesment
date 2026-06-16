import { Hono } from 'hono';
import { prisma } from '../lib/prisma';

export const employeesRoutes = new Hono();

employeesRoutes.get('/', async (c) => {
  const employees = await prisma.employee.findMany({
    where: { deactivatedAt: null },
  });

  return c.json(employees);
});

employeesRoutes.post('/', async (c) => {
  const body = await c.req.json();

  const employee = await prisma.employee.create({
    data: {
      name: body.name,
      role: body.role,
      hourlyRate: Number(body.hourlyRate),
      status: body.status,
    },
  });

  return c.json(employee, 201);
});

employeesRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const employee = await prisma.employee.findUnique({ where: { id } });

  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  if (employee.deactivatedAt) {
    return c.json({ message: 'Employee is already deactivated' }, 409);
  }

  const deactivated = await prisma.employee.update({
    where: { id },
    data: {
      deactivatedAt: new Date(),
      status: 'INACTIVE',
    },
  });

  return c.json(deactivated);
});
