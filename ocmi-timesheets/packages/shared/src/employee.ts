import type { z } from 'zod';
import type { CreateEmployeeSchema, UpdateEmployeeSchema } from './schemas/employee.schema.ts';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  status: EmployeeStatus;
  deactivatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;
