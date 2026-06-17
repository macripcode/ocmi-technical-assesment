import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  hourlyRate: z.coerce.number().positive(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const UpdateEmployeeSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  hourlyRate: z.coerce.number().positive().optional(),
});
