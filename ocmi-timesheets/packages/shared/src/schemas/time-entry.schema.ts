import { z } from 'zod';

export const CreateTimeEntrySchema = z.object({
  employeeId:  z.string().uuid(),
  date:        z.string(),
  hoursWorked: z.number().positive().max(24),
});

export const UpdateTimeEntrySchema = z.object({
  date:        z.string().optional(),
  hoursWorked: z.number().positive().max(24).optional(),
});
