import { z } from 'zod';

const dateNotFuture = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
  .refine(
    (d) => d <= new Date().toISOString().slice(0, 10),
    { message: 'Date cannot be in the future' },
  );

export const CreateTimeEntrySchema = z.object({
  employeeId:  z.string().uuid(),
  date:        dateNotFuture,
  hoursWorked: z.number().positive().max(24),
});

export const UpdateTimeEntrySchema = z.object({
  date:        dateNotFuture.optional(),
  hoursWorked: z.number().positive().max(24).optional(),
});
