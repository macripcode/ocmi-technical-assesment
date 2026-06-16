import type { Employee } from './employee.ts';

export type TimeEntryStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  hoursWorked: number;
  notes: string | null;
  status: TimeEntryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntryWithEmployee extends TimeEntry {
  employee: Employee;
}

export interface CreateTimeEntryInput {
  employeeId: string;
  date: string;
  hoursWorked: number;
  notes?: string;
}
