export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  status: EmployeeStatus;
}
