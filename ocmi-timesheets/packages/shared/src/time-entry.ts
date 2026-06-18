import type { z } from 'zod';
import type { Employee } from './employee.ts';
import type { CreateTimeEntrySchema, UpdateTimeEntrySchema } from './schemas/time-entry.schema.ts';

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  hoursWorked: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntryWithEmployee extends TimeEntry {
  employee: Employee;
}

export type CreateTimeEntryInput = z.infer<typeof CreateTimeEntrySchema>;
export type UpdateTimeEntryInput = z.infer<typeof UpdateTimeEntrySchema>;
