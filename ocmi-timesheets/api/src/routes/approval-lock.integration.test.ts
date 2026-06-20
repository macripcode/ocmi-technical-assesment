import { describe, it, expect, afterEach } from 'vitest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

/**
 * Integration test for the approval-lock flow.
 *
 * Calls app.fetch() directly (no HTTP server needed) and uses the real
 * database so that Prisma constraints and route logic are exercised together.
 */
describe('approval lock flow', () => {
  let employeeId: string | undefined;

  afterEach(async () => {
    if (!employeeId) return;
    // Delete dependents before the employee (no cascade configured in schema)
    await prisma.weeklyTimesheet.deleteMany({ where: { employeeId } });
    await prisma.timeEntry.deleteMany({ where: { employeeId } });
    await prisma.employee.delete({ where: { id: employeeId } });
    employeeId = undefined;
  });

  it('returns 409 and does not persist the entry when the week is approved', async () => {
    // 1. Create an employee
    const empRes = await app.fetch(
      new Request('http://localhost/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Lock Test', lastName: 'Employee', hourlyRate: 20 }),
      })
    );
    expect(empRes.status).toBe(201);
    const employee = (await empRes.json()) as { id: string };
    employeeId = employee.id;

    // 2. Create a time entry in week of 2024-01-08 (Mon)
    const entryRes = await app.fetch(
      new Request('http://localhost/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, date: '2024-01-10', hoursWorked: 8 }),
      })
    );
    expect(entryRes.status).toBe(201);

    // 3. Approve that week
    const approveRes = await app.fetch(
      new Request(`http://localhost/weekly-timesheets/${employeeId}/2024-01-08/approve`, {
        method: 'PATCH',
      })
    );
    expect(approveRes.status).toBe(200);

    // 4. Try to add another entry to the same approved week
    const blockedRes = await app.fetch(
      new Request('http://localhost/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, date: '2024-01-11', hoursWorked: 4 }),
      })
    );

    // 5. The API must reject with 409 Conflict
    expect(blockedRes.status).toBe(409);
    const body = (await blockedRes.json()) as { message: string };
    expect(body.message).toBe('This week is approved and locked');

    // 6. Only the original entry should be in the database
    const entries = await prisma.timeEntry.findMany({ where: { employeeId } });
    expect(entries).toHaveLength(1);
  });

  it('returns 409 and does not modify hours when PATCH is attempted on an approved week entry', async () => {
    // Step 1: Create a test employee
    const empRes = await app.fetch(
      new Request('http://localhost/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Lock Update Test', lastName: 'Employee', hourlyRate: 25 }),
      })
    );
    expect(empRes.status).toBe(201);
    const employee = (await empRes.json()) as { id: string };
    employeeId = employee.id;

    // Step 2: Create a time entry — 8 hours on 2024-02-14 (week of Mon 2024-02-12)
    const entryRes = await app.fetch(
      new Request('http://localhost/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, date: '2024-02-14', hoursWorked: 8 }),
      })
    );
    expect(entryRes.status).toBe(201);
    const entry = (await entryRes.json()) as { id: string };
    const timeEntryId = entry.id;

    // Step 3: Approve the week (weekStart = Mon 2024-02-12)
    const approveRes = await app.fetch(
      new Request(`http://localhost/weekly-timesheets/${employeeId}/2024-02-12/approve`, {
        method: 'PATCH',
      })
    );
    expect(approveRes.status).toBe(200);
    const timesheet = (await approveRes.json()) as { status: string };
    expect(timesheet.status).toBe('APPROVED');

    // Step 4: Attempt to modify hoursWorked (8 → 10) on the approved entry
    const updateRes = await app.fetch(
      new Request(`http://localhost/time-entries/${timeEntryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hoursWorked: 10 }),
      })
    );

    // Expected: modification is rejected with 409 Conflict
    expect(updateRes.status).toBe(409);
    const body = (await updateRes.json()) as { message: string };
    expect(body.message).toBe('This week is approved and locked');

    // Assert: hours in DB are still 8 (not 10)
    const unchanged = await prisma.timeEntry.findUnique({ where: { id: timeEntryId } });
    expect(unchanged?.hoursWorked).toBe(8);
  });
});
