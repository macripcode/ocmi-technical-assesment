import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { CreateEmployeeSchema, UpdateEmployeeSchema } from '@ocmi-timesheets/shared';

export const employeesRoutes = new Hono();

employeesRoutes.get('/', async (c) => {
  const includeInactive = c.req.query('includeInactive') === 'true';

  const employees = await prisma.employee.findMany({
    where: includeInactive ? undefined : { deactivatedAt: null },
    orderBy: { createdAt: 'asc' },
  });

  return c.json(employees);
});

employeesRoutes.post('/', async (c) => {
  const result = CreateEmployeeSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ message: 'Invalid request', errors: result.error.issues }, 400);
  }

  const employee = await prisma.employee.create({
    data: result.data,
  });

  return c.json(employee, 201);
});

employeesRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const result = UpdateEmployeeSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ message: 'Invalid request', errors: result.error.issues }, 400);
  }

  const employee = await prisma.employee.findUnique({ where: { id } });

  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  const updated = await prisma.employee.update({
    where: { id },
    data: result.data,
  });

  return c.json(updated);
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
