import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { getWeekStart } from '@ocmi-timesheets/shared';

export const weeklyTimesheetsRoutes = new Hono();

weeklyTimesheetsRoutes.patch('/:employeeId/:weekStart/approve', async (c) => {
  const employeeId = c.req.param('employeeId');
  const weekStart = getWeekStart(new Date(c.req.param('weekStart')));

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  const timesheet = await prisma.weeklyTimesheet.upsert({
    where: { employeeId_weekStart: { employeeId, weekStart } },
    create: { employeeId, weekStart, status: 'APPROVED' },
    update: { status: 'APPROVED' },
  });

  return c.json(timesheet);
});

weeklyTimesheetsRoutes.patch('/:employeeId/:weekStart/reject', async (c) => {
  const employeeId = c.req.param('employeeId');
  const weekStart = getWeekStart(new Date(c.req.param('weekStart')));

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  const timesheet = await prisma.weeklyTimesheet.upsert({
    where: { employeeId_weekStart: { employeeId, weekStart } },
    create: { employeeId, weekStart, status: 'REJECTED' },
    update: { status: 'REJECTED' },
  });

  return c.json(timesheet);
});
