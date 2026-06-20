import type { EmployeeStatus } from '@ocmi-timesheets/shared';
export type { EmployeeStatus };

export interface Employee {
  id:         string;
  name:       string;
  lastName:   string;
  hourlyRate: number;
  status:     EmployeeStatus;
  createdAt:  Date;
  updatedAt:  Date;
}
