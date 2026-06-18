export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  name: string;
  hourlyRate: number;
  status: EmployeeStatus;
}
