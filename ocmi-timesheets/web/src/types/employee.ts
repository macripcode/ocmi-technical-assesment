export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  name: string;
  lastName: string;
  hourlyRate: number;
  status:     EmployeeStatus;
  createdAt:  Date;
  updatedAt:  Date;
}
